import { body, param } from 'express-validator';

export const createOrganizationValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Organization name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
];

export const orgIdParamValidator = [
  param('orgId').isMongoId().withMessage('Invalid organization id'),
];

export const addMemberValidator = [
  param('orgId').isMongoId().withMessage('Invalid organization id'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['ADMIN', 'MEMBER'])
    .withMessage('Role must be ADMIN or MEMBER'),
];

export const removeMemberValidator = [
  param('orgId').isMongoId().withMessage('Invalid organization id'),
  param('userId').isMongoId().withMessage('Invalid user id'),
];