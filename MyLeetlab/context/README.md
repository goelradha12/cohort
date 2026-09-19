# MyLeetlab Project Context

## Summary
MyLeetlab, branded in the UI as Cook the Code, is a full-stack coding-practice platform. Authenticated users browse problems, edit code in Monaco, run or submit solutions through Judge0, inspect testcase results and submissions, mark solved problems, manage playlists, and view profile statistics. Verified administrators can create, edit, and delete problems.

This folder is the implementation-based reference for future coding work. It is intentionally separate from the shorter package READMEs.

## Context map
| Document | Purpose |
|---|---|
| [project-overview.md](project-overview.md) | Scope, personas, implemented capabilities, and status |
| [architecture.md](architecture.md) | Runtime boundaries and request/data flow |
| [tech-stack.md](tech-stack.md) | Languages, frameworks, packages, and versions |
| [directory-structure.md](directory-structure.md) | Source tree and ownership map |
| [features.md](features.md) | User-visible features and their implementation locations |
| [feature-code-map.md](feature-code-map.md) | Feature → UI/store/route/controller cross-reference for fast navigation |
| [application-flow.md](application-flow.md) | Authentication, problem-solving, and admin flows |
| [frontend.md](frontend.md) | React routes, pages, components, and UI behavior |
| [backend.md](backend.md) | Express bootstrap, middleware, controllers, and utilities |
| [api-documentation.md](api-documentation.md) | Registered API endpoints, guards, inputs, and responses |
| [database.md](database.md) | Prisma schema, relationships, indexes, and migration history |
| [authentication-and-authorization.md](authentication-and-authorization.md) | Tokens, cookies, verification, roles, and guards |
| [state-management.md](state-management.md) | Zustand stores and client-side state transitions |
| [integrations.md](integrations.md) | Judge0, email, Cloudinary, Axios, and Monaco integration |
| [configuration-and-environment.md](configuration-and-environment.md) | Environment variable names and local configuration |
| [development-workflow.md](development-workflow.md) | Install, run, format, lint, and migration workflow |
| [testing.md](testing.md) | Available validation and missing automated test infrastructure |
| [deployment.md](deployment.md) | What deployment configuration exists and what is not found |
| [coding-conventions.md](coding-conventions.md) | Verified style and implementation patterns |
| [business-logic.md](business-logic.md) | Domain rules for problems, execution, submissions, and playlists |
| [known-issues-and-limitations.md](known-issues-and-limitations.md) | Observed risks, inconsistencies, and limits |
| [roadmap-and-todos.md](roadmap-and-todos.md) | Explicit future notes and derived follow-up areas |
| [ai-development-guide.md](ai-development-guide.md) | Practical instructions for an AI coding assistant |

## Quick start for an AI assistant
1. Read this file and [ai-development-guide.md](ai-development-guide.md).
2. For API or data changes, read [api-documentation.md](api-documentation.md), [database.md](database.md), and the relevant backend controller/validator.
3. For UI changes, read [frontend.md](frontend.md), [state-management.md](state-management.md), and the owning page/store.
4. Treat `backend/prisma/schema.prisma` and registered routes as the source of truth; README feature lists are stale in places.
5. Never copy values from `backend/.env`. Use variable names and placeholders only.

## Important locations
- `frontend/src/App.jsx`: browser route table and auth-aware routing.
- `frontend/src/store/`: client API state and loading/error flags.
- `frontend/src/page/ProblemPage.jsx`: editor, execution, submission, and result workflow.
- `backend/src/index.js`: Express bootstrap and API prefixes.
- `backend/src/routes/`: endpoint registration and guards.
- `backend/src/controllers/`: request behavior and Prisma operations.
- `backend/src/middlewares/auth.middlewares.js`: access-token, verification, and admin checks.
- `backend/prisma/schema.prisma`: current database contract.

## Maintenance rule
Update the relevant context document whenever a major route, model, integration, workflow, package, or deployment process changes. Keep uncertainty labels explicit and do not turn planned behavior into an implemented feature.
