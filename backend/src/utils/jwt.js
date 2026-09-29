import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Sign a JWT for a user.
 * Payload contains only the user id — never put sensitive data in JWT,
 * because anyone can decode it (it's signed, not encrypted).
 *
 * @param {string} userId - MongoDB ObjectId as string
 * @returns {string} signed JWT
 */
export function signToken(userId) {
  return jwt.sign(
    { sub: userId },              // 'sub' = subject (standard JWT claim)
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
}

/**
 * Verify a JWT and return its payload.
 * Throws JsonWebTokenError / TokenExpiredError on failure —
 * the global errorHandler converts these to 401 responses.
 *
 * @param {string} token
 * @returns {{ sub: string, iat: number, exp: number }}
 */
export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}