import { Router } from 'express';

import {
  createOrganization,
  listOrganizations,
  getOrganization,
  listMembers,
  addMember,
  removeMember,
} from '../controllers/organization.controller.js';

// ← NEW: project controllers
import {
  listProjects,
  createProject,
} from '../controllers/project.controller.js';

import {
  createOrganizationValidator,
  orgIdParamValidator,
  addMemberValidator,
  removeMemberValidator,
} from '../validators/organization.validator.js';

// ← NEW: project validators
import { createProjectValidator } from '../validators/project.validator.js';

import validate from '../middlewares/validate.js';
import authMiddleware from '../middlewares/auth.js';
import { requireOrgMember } from '../middlewares/tenant.js';
import { requireRole } from '../middlewares/role.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

// All org routes require authentication
router.use(authMiddleware);

// --- Top-level: create + list ---
router.post('/', createOrganizationValidator, validate, createOrganization);
router.get('/', listOrganizations);

// --- Org-specific routes (tenant-scoped) ---
router.get(
  '/:orgId',
  orgIdParamValidator,
  validate,
  requireOrgMember('orgId'),
  getOrganization
);

router.get(
  '/:orgId/members',
  orgIdParamValidator,
  validate,
  requireOrgMember('orgId'),
  listMembers
);

router.post(
  '/:orgId/members',
  addMemberValidator,
  validate,
  requireOrgMember('orgId'),
  requireRole(ROLES.OWNER, ROLES.ADMIN),
  addMember
);

router.delete(
  '/:orgId/members/:userId',
  removeMemberValidator,
  validate,
  requireOrgMember('orgId'),
  requireRole(ROLES.OWNER, ROLES.ADMIN),
  removeMember
);

// --- Nested project routes (org-scoped) ---  ← NEW
router.get(
  '/:orgId/projects',
  orgIdParamValidator,
  validate,
  requireOrgMember('orgId'),
  listProjects
);

router.post(
  '/:orgId/projects',
  createProjectValidator,
  validate,
  requireOrgMember('orgId'),
  requireRole(ROLES.OWNER, ROLES.ADMIN),
  createProject
);

export default router;