import Project from '../models/Project.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/organizations/:orgId/projects
 * Requires: authMiddleware + requireOrgMember('orgId')
 * Lists all projects in the current active org.
 */
export const listProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ orgId: req.orgId })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name email')
    .lean();

  res.json({
    success: true,
    data: { projects },
  });
});

/**
 * POST /api/organizations/:orgId/projects
 * Requires: authMiddleware + requireOrgMember('orgId') + requireRole(OWNER, ADMIN)
 */
export const createProject = asyncHandler(async (req, res) => {
  const { name, description = '' } = req.body;

  const project = await Project.create({
    name,
    description,
    orgId: req.orgId,          // ← from middleware, NOT from body
    createdBy: req.user._id,
  });

  const populated = await project.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    data: { project: populated.toJSON() },
  });
});

/**
 * GET /api/projects/:projectId
 * Requires: authMiddleware + requireProjectAccess
 */
export const getProject = asyncHandler(async (req, res) => {
  // req.project already fetched by middleware, just need creator populated
  await req.project.populate('createdBy', 'name email');

  res.json({
    success: true,
    data: {
      project: req.project.toJSON(),
      role: req.membership.role,   // handy for frontend to gate UI
    },
  });
});

/**
 * PATCH /api/projects/:projectId
 * Requires: authMiddleware + requireProjectAccess + requireRole(OWNER, ADMIN)
 */
export const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // Only update provided fields (PATCH semantics)
  if (name !== undefined) req.project.name = name;
  if (description !== undefined) req.project.description = description;

  await req.project.save();
  await req.project.populate('createdBy', 'name email');

  res.json({
    success: true,
    data: { project: req.project.toJSON() },
  });
});

/**
 * DELETE /api/projects/:projectId
 * Requires: authMiddleware + requireProjectAccess + requireRole(OWNER, ADMIN)
 *
 * NOTE: Tasks of this project are NOT auto-deleted here.
 * We will add cascade cleanup in Phase 7 when the Task model is in scope.
 */
export const deleteProject = asyncHandler(async (req, res) => {
  await req.project.deleteOne();

  res.json({
    success: true,
    data: { message: 'Project deleted' },
  });
});