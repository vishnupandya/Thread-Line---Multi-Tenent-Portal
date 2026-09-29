import { Router } from 'express';

import {
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';

import {
  taskIdParamValidator,
  updateTaskValidator,
} from '../validators/task.validator.js';

import validate from '../middlewares/validate.js';
import authMiddleware from '../middlewares/auth.js';
import requireTaskAccess from '../middlewares/taskAccess.js';
import { requireRole } from '../middlewares/role.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(authMiddleware);

// --- All routes use requireTaskAccess (Task → Project → Org chain) ---

router.get(
  '/:taskId',
  taskIdParamValidator,
  validate,
  requireTaskAccess,
  getTask
);

router.patch(
  '/:taskId',
  updateTaskValidator,
  validate,
  requireTaskAccess,
  updateTask    // permission logic handled inside controller
);

router.delete(
  '/:taskId',
  taskIdParamValidator,
  validate,
  requireTaskAccess,
  requireRole(ROLES.OWNER, ROLES.ADMIN),
  deleteTask
);

export default router;