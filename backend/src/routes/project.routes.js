import { Router } from 'express';

import {
  getProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller.js';

// ← NEW
import {
  listTasks,
  createTask,
} from '../controllers/task.controller.js';

import {
  projectIdParamValidator,
  updateProjectValidator,
} from '../validators/project.validator.js';

// ← NEW
import { createTaskValidator } from '../validators/task.validator.js';

import validate from '../middlewares/validate.js';
import authMiddleware from '../middlewares/auth.js';
import requireProjectAccess from '../middlewares/projectAccess.js';
import { requireRole } from '../middlewares/role.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(authMiddleware);

// --- Project routes ---
router.get(
  '/:projectId',
  projectIdParamValidator,
  validate,
  requireProjectAccess,
  getProject
);

router.patch(
  '/:projectId',
  updateProjectValidator,
  validate,
  requireProjectAccess,
  requireRole(ROLES.OWNER, ROLES.ADMIN),
  updateProject
);

router.delete(
  '/:projectId',
  projectIdParamValidator,
  validate,
  requireProjectAccess,
  requireRole(ROLES.OWNER, ROLES.ADMIN),
  deleteProject
);

// --- Nested task routes ---  ← NEW
router.get(
  '/:projectId/tasks',
  projectIdParamValidator,
  validate,
  requireProjectAccess,
  listTasks
);

router.post(
  '/:projectId/tasks',
  createTaskValidator,
  validate,
  requireProjectAccess,
  requireRole(ROLES.OWNER, ROLES.ADMIN),
  createTask
);

export default router;