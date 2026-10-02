import User from '../models/User.js';
import Membership from '../models/Membership.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { signToken } from '../utils/jwt.js';
import env from '../config/env.js';

/**
 * Set JWT as httpOnly cookie.
 * - httpOnly: JS cannot read it (XSS safe)
 * - secure:   HTTPS only in production
 * - sameSite: 'lax' in dev (same-origin), 'none' in prod (cross-domain)
 */
function setAuthCookie(res, token) {
  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.IS_PROD,
    sameSite: env.IS_PROD ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/',
  });
}

/**
 * POST /api/auth/register
 * Creates user, signs JWT, sets cookie.
 * No organization is created here — user creates one separately.
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check duplicate (unique index will also catch, but this gives nicer error)
  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict('Email already registered');
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password, // will be hashed by pre-save hook
  });

  const token = signToken(user._id.toString(), user.tokenVersion || 0);
  setAuthCookie(res, token);

  res.status(201).json({
    success: true,
    data: {
      user: user.toJSON(),
    },
  });
});

/**
 * POST /api/auth/login
 * Verifies credentials, sets cookie.
 * Uses the SAME error message for "no user" and "wrong password" (anti-enumeration).
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // passwordHash has select:false, so explicitly include it
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const match = await user.comparePassword(password);
  if (!match) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const token = signToken(user._id.toString(), user.tokenVersion || 0);
  setAuthCookie(res, token);

  res.json({
    success: true,
    data: {
      user: user.toJSON(),
    },
  });
});

/**
 * POST /api/auth/logout
 * Clears cookie session. Preserves multi-session compatibility for shared demo accounts.
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    secure: env.IS_PROD,
    sameSite: env.IS_PROD ? 'none' : 'lax',
    path: '/',
  });

  res.json({
    success: true,
    data: { message: 'Logged out successfully' },
  });
});

/**
 * GET /api/auth/me
 * Returns current user + their organizations (for the org switcher).
 * Requires authMiddleware.
 */
export const me = asyncHandler(async (req, res) => {
  const memberships = await Membership.find({ userId: req.user._id })
    .populate('orgId', 'name slug ownerId')
    .lean();

  // Shape: [{ organization, role, membershipId }]
  const organizations = memberships
    .filter((m) => m.orgId) // safety: org may have been deleted
    .map((m) => ({
      membershipId: m._id,
      role: m.role,
      organization: m.orgId,
    }));

  res.json({
    success: true,
    data: {
      user: req.user.toJSON(),
      organizations,
    },
  });
});