import mongoose from 'mongoose';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import Membership from '../models/Membership.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Task access guard.
 *
 * The tricky part: Task has no orgId. We must resolve:
 *   Task → Project → orgId → Membership
 *
 * Attaches:
 *   - req.task        (Task document)
 *   - req.project     (owning Project document)
 *   - req.membership  (membership of req.user in project.orgId)
 *   - req.orgId       (project.orgId as string)
 *
 * Returns 404 (not 403) if user has no access — no resource disclosure.
 */
const requireTaskAccess = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required');
  }

  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw ApiError.notFound('Task not found');
  }

  // --- Stage 1: fetch task ---
  const task = await Task.findById(taskId);
  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  // --- Stage 2: fetch owning project ---
  const project = await Project.findById(task.projectId);
  if (!project) {
    // Orphan task (project was deleted without cascade) — treat as not found
    throw ApiError.notFound('Task not found');
  }

  // --- Stage 3: verify membership in project's org ---
  const membership = await Membership.findOne({
    userId: req.user._id,
    orgId: project.orgId,
  });

  if (!membership) {
    throw ApiError.notFound('Task not found');
  }

  // --- Attach ---
  req.task = task;
  req.project = project;
  req.membership = membership;
  req.orgId = project.orgId.toString();

  next();
});

export default requireTaskAccess;