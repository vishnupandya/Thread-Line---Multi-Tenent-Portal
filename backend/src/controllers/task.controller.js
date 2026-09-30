import Task from '../models/Task.js';
import Membership from '../models/Membership.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ROLES } from '../utils/constants.js';

/**
 * List all tasks for a project.
 * Requires: authMiddleware + requireProjectAccess (attaches req.project, req.orgId)
 *
 * Supports optional filters: ?status=TODO&assigneeId=...
 */
export const listTasks = asyncHandler(async (req, res) => {
  const { status, assigneeId, priority } = req.query;

  const filter = { projectId: req.project._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assigneeId) filter.assigneeId = assigneeId;

  const tasks = await Task.find(filter)
    .sort({ createdAt: -1 })
    .populate('assigneeId', 'name email')
    .populate('createdBy', 'name email')
    .lean();

  res.json({
    success: true,
    data: { tasks },
  });
});

/**
 * Create a task in a project.
 * Requires: authMiddleware + requireProjectAccess
 *
 * Assignee must be a member of the same org as the project.
 */
export const createTask = asyncHandler(async (req, res) => {
  if (![ROLES.OWNER, ROLES.ADMIN].includes(req.membership.role)) {
    throw ApiError.forbidden('Only owners and admins can create tasks');
  }

  const {
    title,
    description = '',
    status,
    priority,
    assigneeId = null,
  } = req.body;

  // --- Verify assignee is a member of THIS org ---
  if (assigneeId) {
    const assigneeMembership = await Membership.findOne({
      userId: assigneeId,
      orgId: req.orgId,
    });
    if (!assigneeMembership) {
      throw ApiError.badRequest(
        'Assignee is not a member of this organization'
      );
    }
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    projectId: req.project._id,
    assigneeId,
    createdBy: req.user._id,
  });

  await task.populate([
    { path: 'assigneeId', select: 'name email' },
    { path: 'createdBy', select: 'name email' },
  ]);

  res.status(201).json({
    success: true,
    data: { task: task.toJSON() },
  });
});

/**
 * Get a single task.
 * Requires: authMiddleware + requireTaskAccess (attaches req.task)
 */
export const getTask = asyncHandler(async (req, res) => {
  await req.task.populate([
    { path: 'assigneeId', select: 'name email' },
    { path: 'createdBy', select: 'name email' },
  ]);

  res.json({
    success: true,
    data: {
      task: req.task.toJSON(),
      role: req.membership.role,
    },
  });
});

/**
 * Update a task (partial).
 * Requires: authMiddleware + requireTaskAccess
 *
 * Permission rules:
 *   - OWNER / ADMIN  → can update any field (title, description, status, priority, assigneeId)
 *   - MEMBER         → can ONLY update task status (TODO -> IN_PROGRESS -> DONE)
 */
export const updateTask = asyncHandler(async (req, res) => {
  const isPrivileged = [ROLES.OWNER, ROLES.ADMIN].includes(req.membership.role);

  const { title, description, status, priority, assigneeId } = req.body;

  if (!isPrivileged) {
    // Member cannot edit details, assignees, or priority
    if (
      title !== undefined ||
      description !== undefined ||
      priority !== undefined ||
      assigneeId !== undefined
    ) {
      throw ApiError.forbidden(
        'Members are only permitted to update task status'
      );
    }
  }

  // --- Validate new assignee (if provided and not null) ---
  if (assigneeId !== undefined && assigneeId !== null) {
    const assigneeMembership = await Membership.findOne({
      userId: assigneeId,
      orgId: req.orgId,
    });
    if (!assigneeMembership) {
      throw ApiError.badRequest(
        'Assignee is not a member of this organization'
      );
    }
  }

  if (title !== undefined) req.task.title = title;
  if (description !== undefined) req.task.description = description;
  if (status !== undefined) req.task.status = status;
  if (priority !== undefined) req.task.priority = priority;
  if (assigneeId !== undefined) req.task.assigneeId = assigneeId; // null allowed

  await req.task.save();
  await req.task.populate([
    { path: 'assigneeId', select: 'name email' },
    { path: 'createdBy', select: 'name email' },
  ]);

  res.json({
    success: true,
    data: { task: req.task.toJSON() },
  });
});

/**
 * Delete a task.
 * Requires: authMiddleware + requireTaskAccess
 * Permission: OWNER / ADMIN only.
 */
export const deleteTask = asyncHandler(async (req, res) => {
  await req.task.deleteOne();
  res.json({
    success: true,
    data: { message: 'Task deleted' },
  });
});