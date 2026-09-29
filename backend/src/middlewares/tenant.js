import Membership from '../models/Membership.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Tenant guard middleware factory.
 *
 * Verifies that the authenticated user is a member of the organization
 * identified by a param OR body field. Attaches req.membership and req.orgId.
 *
 * ⚠️  Returns 404 (not 403) if membership is missing — avoids leaking
 * whether an organization exists.
 *
 * Usage:
 *   // orgId from URL params
 *   router.get('/organizations/:orgId/projects',
 *     authMiddleware,
 *     requireOrgMember('orgId'),
 *     controller
 *   );
 *
 *   // orgId from body (for POST where URL has no org)
 *   router.post('/projects',
 *     authMiddleware,
 *     requireOrgMember({ source: 'body', field: 'orgId' }),
 *     controller
 *   );
 */
export function requireOrgMember(sourceOrParam = 'orgId') {
  // Support two styles: string (params) or object ({ source, field })
  const { source, field } =
    typeof sourceOrParam === 'string'
      ? { source: 'params', field: sourceOrParam }
      : { source: sourceOrParam.source, field: sourceOrParam.field };

  return asyncHandler(async (req, res, next) => {
    // --- Assumes authMiddleware already ran ---
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    // --- Extract orgId from the specified source ---
    const orgId = req[source]?.[field];

    if (!orgId) {
      throw ApiError.badRequest(`Missing organization identifier`);
    }

    // --- Verify membership: this is THE tenant check ---
    const membership = await Membership.findOne({
      userId: req.user._id,
      orgId,
    });

    if (!membership) {
      // 404, not 403 — resource disclosure prevention
      throw ApiError.notFound('Organization not found');
    }

    // --- Attach for downstream middlewares/controllers ---
    req.membership = membership;
    req.orgId = orgId;

    next();
  });
}