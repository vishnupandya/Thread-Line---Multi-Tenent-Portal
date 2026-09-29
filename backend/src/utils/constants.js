/**
 * Shared constants across models, validators, controllers.
 * Single source of truth — change here, reflects everywhere.
 */

export const ROLES = Object.freeze({
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
});

export const ROLE_VALUES = Object.freeze(Object.values(ROLES));

// Higher number = higher authority
export const ROLE_HIERARCHY = Object.freeze({
  [ROLES.OWNER]: 3,
  [ROLES.ADMIN]: 2,
  [ROLES.MEMBER]: 1,
});

export const TASK_STATUS = Object.freeze({
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
});

export const TASK_STATUS_VALUES = Object.freeze(Object.values(TASK_STATUS));

export const TASK_PRIORITY = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
});

export const TASK_PRIORITY_VALUES = Object.freeze(Object.values(TASK_PRIORITY));