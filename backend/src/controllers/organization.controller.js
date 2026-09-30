import mongoose from 'mongoose';
import Organization from '../models/Organization.js';
import Membership from '../models/Membership.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateUniqueSlug } from '../utils/slug.js';
import { ROLES } from '../utils/constants.js';

/**
 * POST /api/organizations
 * Create an org and auto-add creator as OWNER.
 * Uses a transaction so both succeed or both fail.
 */
export const createOrganization = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const slug = await generateUniqueSlug(name);

  // --- Transaction: org + membership must both succeed ---
  const session = await mongoose.startSession();
  let org, membership;

  try {
    await session.withTransaction(async () => {
      [org] = await Organization.create(
        [{ name, slug, ownerId: req.user._id }],
        { session }
      );

      [membership] = await Membership.create(
        [{ userId: req.user._id, orgId: org._id, role: ROLES.OWNER }],
        { session }
      );
    });
  } finally {
    await session.endSession();
  }

  res.status(201).json({
    success: true,
    data: {
      organization: org.toJSON(),
      role: membership.role,
    },
  });
});

/**
 * GET /api/organizations
 * List all orgs the current user is a member of.
 */
export const listOrganizations = asyncHandler(async (req, res) => {
  const memberships = await Membership.find({ userId: req.user._id })
    .populate('orgId', 'name slug ownerId createdAt')
    .lean();

  const organizations = memberships
    .filter((m) => m.orgId)
    .map((m) => ({
      ...m.orgId,
      role: m.role,
      membershipId: m._id,
    }));

  res.json({
    success: true,
    data: { organizations },
  });
});

/**
 * GET /api/organizations/:orgId
 * Requires: authMiddleware + requireOrgMember('orgId')
 * req.membership and req.orgId available.
 */
export const getOrganization = asyncHandler(async (req, res) => {
  const org = await Organization.findById(req.orgId).lean();
  if (!org) {
    // Deleted between membership check and here — rare but handle
    throw ApiError.notFound('Organization not found');
  }

  res.json({
    success: true,
    data: {
      organization: org,
      role: req.membership.role,
    },
  });
});

/**
 * GET /api/organizations/:orgId/members
 * Requires: authMiddleware + requireOrgMember('orgId')
 */
export const listMembers = asyncHandler(async (req, res) => {
  const memberships = await Membership.find({ orgId: req.orgId })
    .populate('userId', 'name email')
    .lean();

  const members = memberships
    .filter((m) => m.userId)
    .map((m) => ({
      membershipId: m._id,
      role: m.role,
      user: m.userId,
    }));

  res.json({
    success: true,
    data: { members },
  });
});

/**
 * POST /api/organizations/:orgId/members
 * Add a member by email. Requires OWNER or ADMIN.
 */
export const addMember = asyncHandler(async (req, res) => {
  const { email, role = ROLES.MEMBER } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.notFound('No user found with that email');
  }

  // Prevent adding someone who is already a member
  const existing = await Membership.findOne({
    userId: user._id,
    orgId: req.orgId,
  });
  if (existing) {
    throw ApiError.conflict('User is already a member of this organization');
  }

  const membership = await Membership.create({
    userId: user._id,
    orgId: req.orgId,
    role,
  });

  res.status(201).json({
    success: true,
    data: {
      member: {
        membershipId: membership._id,
        role: membership.role,
        user: user.toJSON(),
      },
    },
  });
});

/**
 * DELETE /api/organizations/:orgId/members/:userId
 * Remove a member. Requires OWNER or ADMIN.
 * Rules:
 *  - Cannot remove the OWNER (owner can never be removed)
 *  - ADMIN cannot remove another ADMIN (only OWNER can)
 */
export const removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const target = await Membership.findOne({
    userId,
    orgId: req.orgId,
  });
  if (!target) {
    throw ApiError.notFound('Membership not found');
  }

  if (target.role === ROLES.OWNER) {
    throw ApiError.forbidden('Cannot remove the organization owner');
  }

  // ADMIN cannot remove another ADMIN
  if (
    req.membership.role === ROLES.ADMIN &&
    target.role === ROLES.ADMIN
  ) {
    throw ApiError.forbidden('Admins cannot remove other admins');
  }

  await target.deleteOne();

  res.json({
    success: true,
    data: { message: 'Member removed' },
  });
});

/**
 * DELETE /api/organizations/:orgId
 * Delete organization and cascade delete its memberships, projects, and tasks.
 * Strict: OWNER only.
 */
export const deleteOrganization = asyncHandler(async (req, res) => {
  if (req.membership.role !== ROLES.OWNER) {
    throw ApiError.forbidden('Only the organization owner can delete this organization');
  }

  const orgId = req.orgId;

  // Find all projects belonging to this org
  const projects = await Project.find({ orgId }).select('_id');
  const projectIds = projects.map((p) => p._id);

  // Cascade delete tasks, projects, memberships, and the organization
  await Promise.all([
    Task.deleteMany({ projectId: { $in: projectIds } }),
    Project.deleteMany({ orgId }),
    Membership.deleteMany({ orgId }),
    Organization.findByIdAndDelete(orgId),
  ]);

  res.json({
    success: true,
    data: { message: 'Organization and associated resources deleted successfully' },
  });
});