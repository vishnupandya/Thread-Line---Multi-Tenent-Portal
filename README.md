# 🚀 ThreadLine — Multi-Tenant Project Portal

A robust, enterprise-grade Multi-Tenant Project & Task Management Portal built using the **MERN** stack (MongoDB, Express, React, Node.js). 

This project demonstrates strict **server-side tenant isolation**, **hierarchical Role-Based Access Control (RBAC)**, **multi-tenant data modeling**, **organization switching**, and a modern **responsive UI**.

---

## 📑 Table of Contents
- [Tech Stack](#-tech-stack)
- [Architecture & Multi-Tenancy Design](#-architecture--multi-tenancy-design)
- [Security & Tenant Isolation Chain](#-security--tenant-isolation-chain)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [Database Models & Indexing Strategy](#-database-models--indexing-strategy)
- [API Reference](#-api-reference)
- [Local Setup & Run Instructions](#-local-setup--run-instructions)
- [Environment Variables](#-environment-variables)
- [Demo Credentials & Seed Data](#-demo-credentials--seed-data)
- [Automated Testing](#-automated-testing)
- [Architectural Decisions & Trade-Offs](#-architectural-decisions--trade-offs)
- [Known Limitations & Future Improvements](#-known-limitations--future-improvements)

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide React, Axios, React Router v7 |
| **Backend** | Node.js (v24), Express.js, JSON Web Tokens (JWT), Bcrypt.js, Helmet, Morgan |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Validation** | Express-Validator (Request schemas & sanitization) |

---

## 🏛 Architecture & Multi-Tenancy Design

### Multi-Tenancy Model: Shared Database, Shared Process, Discriminator-Isolated Collections
We employ a **Shared Database / Shared Collection** architecture with logical isolation via foreign key tenant identifiers (`orgId`), indexed for zero query overhead.
- A user can belong to **multiple organizations** simultaneously.
- An explicit `Membership` join collection decouples the User identity from Organization-specific roles (`OWNER`, `ADMIN`, `MEMBER`).
- When navigating, an active organization context is maintained on the client and verified on every server request.

```
       ┌─────────────────┐
       │   User (Auth)   │
       └────────┬────────┘
                │ 1..N
       ┌────────▼────────┐
       │   Membership    │  ◄── Enforces Role (OWNER / ADMIN / MEMBER)
       └────────┬────────┘
                │ N..1
       ┌────────▼────────┐
       │  Organization   │
       └────────┬────────┘
                │ 1..N
       ┌────────▼────────┐
       │     Project     │  ◄── Belongs strictly to 1 Organization
       └────────┬────────┘
                │ 1..N
       ┌────────▼────────┐
       │      Task       │  ◄── Belongs to 1 Project (scoped to Org)
       └─────────────────┘
```

---

## 🛡 Security & Tenant Isolation Chain

The core evaluation theme of this system is **non-bypassable tenant isolation**. The backend never trusts client-supplied organization identifiers or route parameters blindly.

Every request flows through an explicit validation chain:

```
Incoming Request
       │
       ▼
1. authMiddleware
   └── Verifies JWT (Bearer token or HTTP-only Cookie). Attaches `req.user`.
       │
       ▼
2. requireOrgMember (Tenant Guard)
   └── Validates that `req.user` holds an active `Membership` in `req.params.orgId`.
       Attaches `req.membership` and `req.orgId`.
       │
       ▼
3. requireRole (RBAC Guard)
   └── Validates whether `req.membership.role` satisfies required operation privileges.
       │
       ▼
4. requireProjectAccess / requireTaskAccess (Resource Isolation)
   └── Traverses Task → Project → Org.
       If resource belongs to Org B while user is in Org A:
       RETURNS 404 NOT FOUND (prevents cross-tenant resource enumeration).
       │
       ▼
Controller Execution
```

> **Resource-Disclosure Defense**: When a user attempts to access an unauthorized resource (e.g. `GET /api/projects/:id-from-other-org`), the API responds with `404 Not Found` rather than `403 Forbidden`. This conceals the existence of resources across organizational boundaries.

---

## 👥 Role-Based Access Control (RBAC)

The portal implements three distinct tiers of privileges:

| Privilege / Action | OWNER | ADMIN | MEMBER |
| :--- | :---: | :---: | :---: |
| **View Projects & Tasks** | ✅ | ✅ | ✅ |
| **Update Task Status (`TODO` → `IN_PROGRESS` → `DONE`)** | ✅ | ✅ | ✅ |
| **Create / Edit / Delete Tasks** | ✅ | ✅ | ❌ |
| **Assign Tasks to Members** | ✅ | ✅ | ❌ |
| **Create / Edit / Delete Projects** | ✅ | ✅ | ❌ |
| **Invite / Add New Members** | ✅ | ✅ | ❌ |
| **Remove Regular Members** | ✅ | ✅ | ❌ |
| **Remove Admins** | ✅ | ❌ | ❌ |
| **Delete Organization** | ✅ | ❌ | ❌ |

---

## 🗄 Database Models & Indexing Strategy

1. **User (`User.js`)**
   - Fields: `name`, `email` (unique index), `passwordHash` (excluded by default in queries).
   - Password hashed with `bcryptjs` (salt rounds: 10).

2. **Organization (`Organization.js`)**
   - Fields: `name`, `slug` (unique index), `ownerId` (ref `User`).

3. **Membership (`Membership.js`)**
   - Fields: `userId`, `orgId`, `role` (`OWNER`, `ADMIN`, `MEMBER`).
   - **Composite Index**: `{ userId: 1, orgId: 1 }` (unique) — ensures a user cannot have duplicate memberships in one org.
   - Lookups: `{ orgId: 1 }`, `{ userId: 1 }`.

4. **Project (`Project.js`)**
   - Fields: `name`, `description`, `orgId`, `createdBy`.
   - **Compound Index**: `{ orgId: 1, createdAt: -1 }` — guarantees fast retrieval of an organization's projects without table scans.

5. **Task (`Task.js`)**
   - Fields: `title`, `description`, `status`, `priority`, `projectId`, `assigneeId`, `createdBy`.
   - **Compound Index**: `{ projectId: 1, createdAt: -1 }` — rapid retrieval of tasks for Kanban boards.
   - **Compound Index**: `{ assigneeId: 1, status: 1 }` — rapid querying of user assigned workloads.

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT | Public |
| `POST` | `/api/auth/logout` | Clear authentication session | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Authenticated |

### Organizations & Memberships
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/organizations` | Create an organization | Authenticated |
| `GET` | `/api/organizations` | List organizations user belongs to | Authenticated |
| `GET` | `/api/organizations/:orgId` | Get organization details | Member |
| `GET` | `/api/organizations/:orgId/members` | List members in organization | Member |
| `POST` | `/api/organizations/:orgId/members` | Add user to organization | Owner, Admin |
| `DELETE` | `/api/organizations/:orgId/members/:userId` | Remove user from organization | Owner, Admin |

### Projects
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/organizations/:orgId/projects` | List projects of organization | Member |
| `POST` | `/api/organizations/:orgId/projects` | Create a project in organization | Owner, Admin |
| `GET` | `/api/projects/:projectId` | Get project details | Org Member |
| `PATCH` | `/api/projects/:projectId` | Update project name/description | Owner, Admin |
| `DELETE` | `/api/projects/:projectId` | Delete project and cascade tasks | Owner, Admin |

### Tasks
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects/:projectId/tasks` | List tasks belonging to a project | Org Member |
| `POST` | `/api/projects/:projectId/tasks` | Create task in project | Owner, Admin |
| `GET` | `/api/tasks/:taskId` | Get task details | Org Member |
| `PATCH` | `/api/tasks/:taskId` | Update task status, priority, or fields | Member (Status) / Admin+ |
| `DELETE` | `/api/tasks/:taskId` | Delete task | Owner, Admin |

---

## ⚡ Local Setup & Run Instructions

### Prerequisites
- Node.js (v18.0 or higher, tested on v24)
- MongoDB instance (Local or MongoDB Atlas URI)

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd multi-tenant-portal

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Create `.env` in both `backend` and `frontend` folders:

```bash
# In backend/.env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/multi-tenant-portal
JWT_SECRET=your-secure-jwt-secret-key-12345
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
COOKIE_NAME=token
```

```bash
# In frontend/.env
VITE_API_URL=http://localhost:5001/api
```

### 3. Seed Demo Data
Populate the database with pre-configured demo organizations, projects, and users:
```bash
cd backend
npm run seed
```

### 4. Start the Application
Run both backend and frontend servers:

```bash
# Terminal 1: Backend (runs on http://localhost:5001)
cd backend
npm run dev

# Terminal 2: Frontend (runs on http://localhost:5173)
cd frontend
npm run dev
```

---

## 🔑 Demo Credentials & Seed Data

The database comes pre-seeded with 3 realistic personas designed to test RBAC and tenant boundaries:

| Email | Password | Role & Scope | What to Test |
| :--- | :--- | :--- | :--- |
| `demo@example.com` | `Demo@1234` | **OWNER** of `Acme Inc` & `Beta Labs` | Full control: create projects, tasks, manage members, switch between both orgs. |
| `amit@example.com` | `Demo@1234` | **ADMIN** of `Acme Inc` only | Can manage projects & tasks in Acme Inc. Has **no access** to Beta Labs. |
| `priya@example.com` | `Demo@1234` | **MEMBER** in `Acme Inc` & `Beta Labs` | Execution role: can view Kanban boards and move tasks (`TODO` → `IN_PROGRESS` → `DONE`), but blocked from creating projects/tasks or deleting data. |

### Cross-Tenant Verification Steps:
1. Log in as `priya@example.com` (present in both Acme Inc and Beta Labs) — notice org switcher has both options.
2. Log in as `amit@example.com` (present in Acme Inc only) — notice Beta Labs does not appear.
3. If Amit attempts to request `GET /api/projects/<BetaLabs-Project-ID>` via Postman/curl, the server immediately denies access with `404 Not Found`.

---

## 🧪 Automated Testing

Run the automated test suite covering RBAC authorization, JWT token security, and password encryption:
```bash
cd backend
npm test
```
*Executes using Node.js's native test runner (`node:test`) with zero external test overhead.*

---

## ⚖️ Architectural Decisions & Trade-Offs

1. **Shared Database & Tenant Discriminator vs. Separate Databases**:
   - *Decision*: Adopted a single database with `orgId` reference keys and compound indexing.
   - *Rationale*: Optimal for startup and SaaS economics; simplifies migrations and connection pooling while maintaining airtight isolation through strict middleware.
2. **404 Not Found vs. 403 Forbidden on Cross-Tenant Access**:
   - *Decision*: Return `404` for unauthorized cross-tenant resource lookups.
   - *Rationale*: A `403` response informs an attacker that a resource exists with that ID. Returning `404` ensures zero information disclosure.
3. **Membership as an Explicit Collection**:
   - *Decision*: Modeled `Membership` as its own collection rather than an embedded array inside `User` or `Organization`.
   - *Rationale*: Eliminates document unbounded growth (MongoDB 16MB document size limit), enables compound unique indexing (`{ userId, orgId }`), and allows painless role changes.
4. **Member Role Execution Model**:
   - *Decision*: Regular `MEMBER` users are dedicated executors. They can transition task states on Kanban boards, but only `ADMIN` and `OWNER` can alter project definitions or remove members.

---

## 🔮 Known Limitations & Future Improvements

- **Task Filtering & Search**: Add full-text search and faceted filters (by assignee, tag, due date) on the Kanban view.
- **Email Invitations**: Implement asynchronous email invitation tokens rather than direct user addition by email.
- **Activity & Audit Logs**: Add change history stream for compliance tracking on project modifications.
- **WebSocket / SSE Live Updates**: Implement real-time board updates when another member moves a task card.
