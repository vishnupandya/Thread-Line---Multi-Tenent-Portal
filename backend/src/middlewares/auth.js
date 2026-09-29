import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwt.js';
import env from '../config/env.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Authentication middleware.
 * - Reads JWT from httpOnly cookie (or Authorization header as fallback)
 * - Verifies it
 * - Loads the user and attaches to req.user
 * - Throws 401 on any failure
 *
 * Usage: router.get('/me', authMiddleware, controller)
 */
const authMiddleware = asyncHandler(async (req, res, next) => {
  // --- Extract token: cookie first, then Bearer header ---
  let token = req.cookies?.[env.COOKIE_NAME];

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7);
  }

  if (!token) {
    throw ApiError.unauthorized('Authentication required');
  }

  // --- Verify (throws on invalid/expired) ---
  const payload = verifyToken(token);

  // --- Load user ---
  const user = await User.findById(payload.sub);
  if (!user) {
    // Token is valid but user was deleted
    throw ApiError.unauthorized('User no longer exists');
  }

  // --- Attach to request for downstream use ---
  req.user = user;
  next();
});

export default authMiddleware;