# AI Development Guide

## Mission and boundaries
This repository is a React/Vite frontend plus Express/Prisma backend for coding practice. Work from verified code. The current schema, route registrations, validators, controllers, stores, and page consumers are the source of truth; package READMEs and old future notes may lag.

## First reads by task
- General orientation: this folder's `README.md`, `architecture.md`, `project-overview.md`.
- UI/page change: `frontend.md`, `state-management.md`, `frontend/src/App.jsx`, the owning page/component, and the related store.
- API change: `api-documentation.md`, the route, controller, validator, auth middleware, and frontend store consumer.
- Data change: `database.md`, `backend/prisma/schema.prisma`, latest migration, controller queries, and all frontend payload consumers.
- Auth/security change: `authentication-and-authorization.md`, `auth.routes.js`, `auth.controllers.js`, `auth.middlewares.js`, token utility, and Axios cookie settings.
- Execution change: `business-logic.md`, `executeCode.controllers.js`, `judge0lib.js`, execution validator, `ProblemPage.jsx`, and result components.
- Operations change: `configuration-and-environment.md`, `development-workflow.md`, and `deployment.md`.

## Safe feature workflow
1. State the behavior and identify its owning route/page/store/controller.
2. Trace the request from UI action to Axios path, Express middleware, controller, Prisma/integration call, and response consumer.
3. Check existing validators and schema constraints before changing field names.
4. Implement the smallest compatible change in the owning layer. Keep backend authorization even when adding frontend guards.
5. Update both frontend and backend contracts when a request or response changes.
6. Add or update a migration for schema changes; never edit generated Prisma output.
7. Run the narrowest available check: frontend `npm run lint`, then `npm run build`; use manual API/database checks for backend paths because no test suite exists.
8. Review changed docs and paths, then inspect for secrets, accidental logging, and stale assumptions.

## Patterns to preserve
- Use `axiosInstance` with credentials from frontend stores.
- Preserve route prefixes and existing JSON names such as `source_code`, `language_id`, `expected_outputs`, and `problemId`.
- Compose guards before controllers: logged-in, verified/admin, validation, handler.
- Keep loading flags in `finally` and surface failures through the established toast pattern.
- Use Prisma relations and composite unique keys rather than duplicate membership logic.
- Treat `backend/.env`, tokens, passwords, SMTP credentials, and cloud credentials as secret material. Document names only.

## Common mistakes to avoid
- Do not assume README future work is unimplemented.
- Do not call protected APIs without considering both cookie auth and email verification.
- Do not trust `AdminRoute` as a security boundary; enforce admin on the backend.
- Do not change JSON shapes without updating validators, controllers, stores, and components together.
- Do not add a new Judge0 language without updating both ID maps and form/editor language behavior.
- Do not assume `run` is persisted; only the non-run submit handler writes submission data.
- Do not copy the plaintext admin seed credential or any `.env` value into documentation.
- Do not claim deployment, tests, or production cookie behavior that are not present in the repository.

## Documentation upkeep
When adding a route, model, integration, package, workflow, or known limitation, update the matching context document and this guide if the task changes assistant routing. Mark uncertainty as `Unknown`, `Not found`, or `Needs verification` rather than filling gaps with assumptions.
