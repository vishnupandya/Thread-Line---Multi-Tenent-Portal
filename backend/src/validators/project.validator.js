import { body, param } from 'express-validator';

export const createProjectValidator = [
  param('orgId').isMongoId().withMessage('Invalid organization id'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ min: 2, max: 120 })
    .withMessage('Name must be between 2 and 120 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be at most 1000 characters'),
];

export const updateProjectValidator = [
  param('projectId').isMongoId().withMessage('Invalid project id'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 120 })
    .withMessage('Name must be between 2 and 120 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be at most 1000 characters'),
];

export const projectIdParamValidator = [
  param('projectId').isMongoId().withMessage('Invalid project id'),
];

export const orgIdParamValidator = [
  param('orgId').isMongoId().withMessage('Invalid organization id'),
];