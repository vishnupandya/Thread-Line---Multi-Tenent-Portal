/**
 * Seed script — populates demo data for evaluation.
 *
 * Usage:
 *   npm run seed
 *
 * ⚠️  WIPES existing data in the connected database. Dev only.
 */
import mongoose from 'mongoose';

import env from '../src/config/env.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

import User from '../src/models/User.js';
import Organization from '../src/models/Organization.js';
import Membership from '../src/models/Membership.js';
import Project from '../src/models/Project.js';
import Task from '../src/models/Task.js';

import { ROLES, TASK_STATUS, TASK_PRIORITY } from '../src/utils/constants.js';

// ------------------------------------------------------------------
// Demo configuration
// ------------------------------------------------------------------
const DEMO_PASSWORD = 'Demo@1234';

const DEMO_USERS = [
  { name: 'Demo User', email: 'demo@example.com' },
  { name: 'Priya Verma', email: 'priya@example.com' },
  { name: 'Amit Kumar', email: 'amit@example.com' },
];

// ------------------------------------------------------------------
// Wipe all collections
// ------------------------------------------------------------------
async function clearAll() {
  console.log('🧹 Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Organization.deleteMany({}),
    Membership.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({}),
  ]);
}

// ------------------------------------------------------------------
// Main seed routine
// ------------------------------------------------------------------
async function seed() {
  console.log('🌱 Starting seed...\n');

  await clearAll();

  // --- 1. Users ---
  console.log('👥 Creating users...');
  const users = {};
  for (const u of DEMO_USERS) {
    // pass plain password — pre-save hook hashes it
    const user = await User.create({
      name: u.name,
      email: u.email,
      passwordHash: DEMO_PASSWORD,
    });
    users[u.email.split('@')[0]] = user; // key: 'demo', 'priya', 'amit'
    console.log(`   ✓ ${u.email}`);
  }

  const demo = users.demo;
  const priya = users.priya;
  const amit = users.amit;

  // --- 2. Organizations ---
  console.log('\n🏢 Creating organizations...');

  const acme = await Organization.create({
    name: 'Acme Inc',
    slug: 'acme-inc',
    ownerId: demo._id,
  });
  console.log(`   ✓ ${acme.name} (${acme.slug})`);

  const beta = await Organization.create({
    name: 'Beta Labs',
    slug: 'beta-labs',
    ownerId: demo._id,
  });
  console.log(`   ✓ ${beta.name} (${beta.slug})`);

  // --- 3. Memberships ---
  console.log('\n🤝 Creating memberships...');

  const memberships = [
    // Acme: demo is OWNER, priya & amit are MEMBER
    { userId: demo._id, orgId: acme._id, role: ROLES.OWNER },
    { userId: priya._id, orgId: acme._id, role: ROLES.MEMBER },
    { userId: amit._id, orgId: acme._id, role: ROLES.ADMIN },

    // Beta: demo is OWNER, priya is MEMBER (amit is not in Beta)
    { userId: demo._id, orgId: beta._id, role: ROLES.OWNER },
    { userId: priya._id, orgId: beta._id, role: ROLES.MEMBER },
  ];

  for (const m of memberships) {
    await Membership.create(m);
  }
  console.log(`   ✓ ${memberships.length} memberships created`);

  // --- 4. Projects ---
  console.log('\n📁 Creating projects...');

  const acmeWebsite = await Project.create({
    name: 'Website Redesign',
    description: 'Revamp the marketing website with new branding.',
    orgId: acme._id,
    createdBy: demo._id,
  });

  const acmeMobile = await Project.create({
    name: 'Mobile Application',
    description: 'Cross-platform mobile app for customers.',
    orgId: acme._id,
    createdBy: demo._id,
  });

  const betaDashboard = await Project.create({
    name: 'Data Dashboard',
    description: 'Internal analytics dashboard for the ops team.',
    orgId: beta._id,
    createdBy: demo._id,
  });

  console.log(`   ✓ ${acmeWebsite.name}`);
  console.log(`   ✓ ${acmeMobile.name}`);
  console.log(`   ✓ ${betaDashboard.name}`);

  // --- 5. Tasks ---
  console.log('\n✅ Creating tasks...');

  const tasks = [
    // Acme Website Redesign
    {
      title: 'Design homepage hero section',
      description: 'Create hero with headline, subtext, and primary CTA.',
      status: TASK_STATUS.IN_PROGRESS,
      priority: TASK_PRIORITY.HIGH,
      projectId: acmeWebsite._id,
      assigneeId: priya._id,
      createdBy: demo._id,
    },
    {
      title: 'Build responsive navigation',
      description: 'Mobile menu + desktop nav with dropdowns.',
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.MEDIUM,
      projectId: acmeWebsite._id,
      assigneeId: amit._id,
      createdBy: demo._id,
    },
    {
      title: 'Set up analytics tracking',
      description: 'Integrate GA4 and event tracking.',
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.LOW,
      projectId: acmeWebsite._id,
      assigneeId: null,
      createdBy: demo._id,
    },
    {
      title: 'Accessibility audit',
      description: 'WCAG AA compliance review.',
      status: TASK_STATUS.DONE,
      priority: TASK_PRIORITY.MEDIUM,
      projectId: acmeWebsite._id,
      assigneeId: priya._id,
      createdBy: demo._id,
    },

    // Acme Mobile App
    {
      title: 'Splash screen design',
      description: 'Design and export splash screens.',
      status: TASK_STATUS.DONE,
      priority: TASK_PRIORITY.LOW,
      projectId: acmeMobile._id,
      assigneeId: priya._id,
      createdBy: demo._id,
    },
    {
      title: 'Implement auth flow',
      description: 'Login, register, forgot password screens.',
      status: TASK_STATUS.IN_PROGRESS,
      priority: TASK_PRIORITY.HIGH,
      projectId: acmeMobile._id,
      assigneeId: amit._id,
      createdBy: demo._id,
    },

    // Beta Dashboard
    {
      title: 'Define KPI metrics',
      description: 'Agree on metrics to track for Q1.',
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.HIGH,
      projectId: betaDashboard._id,
      assigneeId: priya._id,
      createdBy: demo._id,
    },
    {
      title: 'Wireframe dashboard layout',
      description: 'Sketch main grid + chart placement.',
      status: TASK_STATUS.IN_PROGRESS,
      priority: TASK_PRIORITY.MEDIUM,
      projectId: betaDashboard._id,
      assigneeId: null,
      createdBy: demo._id,
    },
  ];

  for (const t of tasks) {
    await Task.create(t);
  }
  console.log(`   ✓ ${tasks.length} tasks created`);

  // --- 6. Summary ---
  console.log('\n🎉 Seed complete!\n');
  console.log('─'.repeat(60));
  console.log('DEMO CREDENTIALS');
  console.log('─'.repeat(60));
  console.log(`  Password (all users): ${DEMO_PASSWORD}`);
  console.log('');
  console.log('  demo@example.com    →  Acme (OWNER) + Beta (OWNER)');
  console.log('  priya@example.com   →  Acme (MEMBER) + Beta (MEMBER)');
  console.log('  amit@example.com    →  Acme (ADMIN only)');
  console.log('─'.repeat(60));
  console.log('');
  console.log('Try this cross-tenant test:');
  console.log('  1. Login as priya@example.com');
  console.log('  2. Try to access Beta project — ✓ works');
  console.log('  3. Login as amit@example.com');
  console.log('  4. Try to access Beta project — ✗ 404 (blocked)');
  console.log('');
}

// ------------------------------------------------------------------
// Entry point
// ------------------------------------------------------------------
async function main() {
  try {
    await connectDB();
    await seed();
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seed failed:', err);
    try {
      await disconnectDB();
    } catch {
      // ignore disconnect errors
    }
    process.exit(1);
  }
}

main();