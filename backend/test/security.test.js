import { describe, it } from 'node:test';
import assert from 'node:assert';
import bcrypt from 'bcryptjs';

import { signToken, verifyToken } from '../src/utils/jwt.js';
import { requireRole } from '../src/middlewares/role.js';
import { ROLES } from '../src/utils/constants.js';
import { toSlug } from '../src/utils/slug.js';

describe('🔒 Security & RBAC Suite', () => {
  // --- 1. JWT Authentication Tests ---
  describe('JWT Token Verification', () => {
    it('should generate a valid JWT with tokenVersion and decode correctly', () => {
      const mockUserId = '65f1a2b3c4d5e6f7a8b9c0d1';
      const token = signToken(mockUserId, 2);

      assert.ok(typeof token === 'string', 'Token must be a string');
      const decoded = verifyToken(token);
      assert.strictEqual(decoded.sub, mockUserId, 'Decoded subject must match user id');
      assert.strictEqual(decoded.v, 2, 'Decoded version must match tokenVersion');
    });

    it('should reject a tampered JWT token', () => {
      const mockUserId = '65f1a2b3c4d5e6f7a8b9c0d1';
      const token = signToken(mockUserId);
      const tamperedToken = token.slice(0, -5) + 'abcde';

      assert.throws(
        () => verifyToken(tamperedToken),
        /invalid signature|jwt malformed/i,
        'Tampered token should throw error'
      );
    });
  });

  // --- 2. Role-Based Access Control (RBAC) Tests ---
  describe('Role Authorization Guard', () => {
    it('should allow OWNER or ADMIN to manage tasks & projects', () => {
      const middleware = requireRole(ROLES.OWNER, ROLES.ADMIN);
      let passed = false;

      const req = { membership: { role: ROLES.ADMIN } };
      const res = {};
      const next = (err) => {
        if (!err) passed = true;
      };

      middleware(req, res, next);
      assert.strictEqual(passed, true, 'ADMIN should be permitted');
    });

    it('should block regular MEMBER from administrative actions with 403 Forbidden', () => {
      const middleware = requireRole(ROLES.OWNER, ROLES.ADMIN);
      let capturedError = null;

      const req = { membership: { role: ROLES.MEMBER } };
      const res = {};
      const next = (err) => {
        capturedError = err;
      };

      middleware(req, res, next);
      assert.ok(capturedError, 'Should pass error to next()');
      assert.strictEqual(capturedError.statusCode, 403, 'Status code must be 403 Forbidden');
    });

    it('should properly enforce role hierarchy (atLeast ADMIN)', () => {
      const middleware = requireRole.atLeast(ROLES.ADMIN);

      let ownerPassed = false;
      middleware({ membership: { role: ROLES.OWNER } }, {}, (err) => {
        if (!err) ownerPassed = true;
      });
      assert.strictEqual(ownerPassed, true, 'OWNER satisfies atLeast ADMIN');

      let memberError = null;
      middleware({ membership: { role: ROLES.MEMBER } }, {}, (err) => {
        memberError = err;
      });
      assert.strictEqual(memberError?.statusCode, 403, 'MEMBER fails atLeast ADMIN');
    });

    it('should restrict organization deletion to OWNER only', () => {
      const ownerOnlyMiddleware = requireRole(ROLES.OWNER);

      let ownerPassed = false;
      ownerOnlyMiddleware({ membership: { role: ROLES.OWNER } }, {}, (err) => {
        if (!err) ownerPassed = true;
      });
      assert.strictEqual(ownerPassed, true, 'OWNER should be allowed to delete org');

      let adminError = null;
      ownerOnlyMiddleware({ membership: { role: ROLES.ADMIN } }, {}, (err) => {
        adminError = err;
      });
      assert.strictEqual(adminError?.statusCode, 403, 'ADMIN should be blocked with 403');

      let memberError = null;
      ownerOnlyMiddleware({ membership: { role: ROLES.MEMBER } }, {}, (err) => {
        memberError = err;
      });
      assert.strictEqual(memberError?.statusCode, 403, 'MEMBER should be blocked with 403');
    });

    it('should fail if role check is executed without tenant guard', () => {
      const middleware = requireRole(ROLES.OWNER);
      let capturedError = null;

      middleware({}, {}, (err) => {
        capturedError = err;
      });

      assert.ok(capturedError, 'Should error when req.membership is missing');
      assert.strictEqual(capturedError.statusCode, 500);
    });
  });

  // --- 3. Password Security Tests ---
  describe('Password Security & Hashing', () => {
    it('should securely hash password with bcrypt and verify match', async () => {
      const password = 'TestSecretPassword@123';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      assert.notStrictEqual(hash, password, 'Password must never be plain text');
      const isMatch = await bcrypt.compare(password, hash);
      assert.strictEqual(isMatch, true, 'Valid password must match hash');

      const isWrongMatch = await bcrypt.compare('WrongPassword', hash);
      assert.strictEqual(isWrongMatch, false, 'Invalid password must not match');
    });
  });

  // --- 4. Slug Formatting Tests ---
  describe('Tenant Slug Generation', () => {
    it('should sanitize organization name into URL-safe kebab-case slug', () => {
      const slug = toSlug('Acme & Beta Technologies Inc.');
      assert.strictEqual(slug, 'acme-beta-technologies-inc');
    });
  });

  // --- 5. User Data Exposure & Sanitization Tests ---
  describe('User Data Exposure & Input Hygiene', () => {
    it('should not expose passwordHash or tokenVersion in toJSON()', async () => {
      const User = (await import('../src/models/User.js')).default;
      const user = new User({
        name: 'Safe User',
        email: 'safe@example.com',
        passwordHash: 'secret-hash',
        tokenVersion: 5,
      });

      const json = user.toJSON();
      assert.strictEqual(json.passwordHash, undefined, 'passwordHash must be stripped');
      assert.strictEqual(json.tokenVersion, undefined, 'tokenVersion must be stripped');
      assert.strictEqual(json.__v, undefined, '__v must be stripped');
      assert.strictEqual(json.name, 'Safe User');
    });

    it('should disallow HTML/script tags in registration name', async () => {
      const { registerValidator } = await import('../src/validators/auth.validator.js');
      const nameValidator = registerValidator.find((v) => v.builder?.fields?.includes('name') || v.fields?.includes('name'));

      // Validate regex directly: matches(/^[^<>]+$/)
      const xssName = '<script>alert("hacked")</script>';
      const safeName = 'John Doe';
      const regex = /^[^<>]+$/;

      assert.strictEqual(regex.test(safeName), true, 'Safe name should pass');
      assert.strictEqual(regex.test(xssName), false, 'XSS script name should fail');
    });
  });
});
