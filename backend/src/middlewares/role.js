import ApiError from '../utils/ApiError.js';
import { ROLE_HIERARCHY } from '../utils/constants.js';

/**
 * Role guard middleware.
 * Requires req.membership to be set (from requireOrgMember).
 *
 * Two usage modes:
 *   requireRole('OWNER', 'ADMIN')      → user must have one of these roles
 *   requireRole.atLeast('ADMIN')       → user must have >= ADMIN hierarchy
 *
 * Usage:
 *   router.post('/organizations/:orgId/projects',
 *     authMiddleware,
 *     requireOrgMember('orgId'),
 *     requireRole('OWNER', 'ADMIN'),
 *     controller
 *   );
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.membership) {
      return next(ApiError.internal('Role check used without tenant guard'));
    }

    if (!allowedRoles.includes(req.membership.role)) {
      return next(
        ApiError.forbidden('You do not have permission for this action')
      );
    }

    next();
  };
}

/**
 * Hierarchy-based check: user's role must be >= required.
 * e.g. atLeast('ADMIN') allows ADMIN and OWNER.
 */
requireRole.atLeast = function atLeast(requiredRole) {
  return (req, res, next) => {
    if (!req.membership) {
      return next(ApiError.internal('Role check used without tenant guard'));
    }

    const userLevel = ROLE_HIERARCHY[req.membership.role] ?? 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;

    if (userLevel < requiredLevel) {
      return next(
        ApiError.forbidden('You do not have permission for this action')
      );
    }

    next();
  };
};