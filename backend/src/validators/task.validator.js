import { body, param } from 'express-validator';
import { TASK_STATUS_VALUES, TASK_PRIORITY_VALUES } from '../utils/constants.js';

export const createTaskValidator = [
  param('projectId').isMongoId().withMessage('Invalid project id'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be at most 2000 characters'),
  body('status')
    .optional()
    .isIn(TASK_STATUS_VALUES)
    .withMessage(`Status must be one of: ${TASK_STATUS_VALUES.join(', ')}`),
  body('priority')
    .optional()
    .isIn(TASK_PRIORITY_VALUES)
    .withMessage(`Priority must be one of: ${TASK_PRIORITY_VALUES.join(', ')}`),
  body('assigneeId')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('Invalid assignee id'),
];

export const updateTaskValidator = [
  param('taskId').isMongoId().withMessage('Invalid task id'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be at most 2000 characters'),
  body('status')
    .optional()
    .isIn(TASK_STATUS_VALUES)
    .withMessage(`Status must be one of: ${TASK_STATUS_VALUES.join(', ')}`),
  body('priority')
    .optional()
    .isIn(TASK_PRIORITY_VALUES)
    .withMessage(`Priority must be one of: ${TASK_PRIORITY_VALUES.join(', ')}`),
  body('assigneeId')
    .optional({ nullable: true })
    .custom((value) => {
      // Allow explicit null (unassign) OR valid ObjectId
      if (value === null) return true;
      if (typeof value === 'string' && /^[a-f\d]{24}$/i.test(value)) return true;
      throw new Error('Invalid assignee id');
    }),
];

export const taskIdParamValidator = [
  param('taskId').isMongoId().withMessage('Invalid task id'),
];