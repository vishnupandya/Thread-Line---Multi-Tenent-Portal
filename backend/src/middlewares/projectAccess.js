import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Membership from '../models/Membership.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Project access guard.
 *
 * Fetches a project by :projectId, then verifies the authenticated user
 * is a member of the org that owns the project.
 *
 * Attaches:
 *   - req.project     (the Project document)
 *   - req.membership  (Membership of req.user in project.orgId)
 *   - req.orgId       (project.orgId as string)
 *
 * Returns 404 (not 403) if user is not a member — avoids revealing whether
 * the project exists to non-members. This is the tenant isolation guard.
 *
 * Usage:
 *   router.get('/:projectId',
 *     authMiddleware,
 *     requireProjectAccess,
 *     controller
 *   );
 */
const requireProjectAccess = asyncHandler(async (req, res, next) => {
  // --- Assumes authMiddleware ran first ---
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required');
  }

  const { projectId } = req.params;

  // --- Validate ObjectId before hitting DB ---
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw ApiError.notFound('Project not found');
  }

  // --- Fetch project ---
  const project = await Project.findById(projectId);
  if (!project) {
    throw ApiError.notFound('Project not found');
  }

  // --- Verify membership in the project's org ---
  const membership = await Membership.findOne({
    userId: req.user._id,
    orgId: project.orgId,
  });

  if (!membership) {
    // Not a member → pretend project doesn't exist (no disclosure)
    throw ApiError.notFound('Project not found');
  }

  // --- Attach for downstream use ---
  req.project = project;
  req.membership = membership;
  req.orgId = project.orgId.toString();

  next();
});

export default requireProjectAccess;