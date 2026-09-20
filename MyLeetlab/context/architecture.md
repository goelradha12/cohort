# Architecture

## Runtime topology
```text
React/Vite browser
  -> Axios with credentials -> Express API (/api/v1)
  -> PostgreSQL through Prisma
  -> Judge0-compatible HTTP API for code execution
  -> Resend for verification/password mail
  -> Cloudinary for profile images
```

The frontend is served independently by Vite during development. In development, `frontend/src/lib/axios.js` targets `http://localhost:3000/api/v1`; in another mode it uses `/api/v1`, implying a same-origin proxy or deployment arrangement that is not defined in this repository.

## Backend pipeline
`backend/src/index.js` loads dotenv, enables CORS/cookies/body parsing, mounts five routers, and listens on `PORT` or 3000. Route middleware performs authentication and validation before controller functions. Controllers use the Prisma client from `backend/src/libs/db.js` and return `apiResponse`/error-shaped JSON.

## Core data flow
1. Browser page calls a Zustand action.
2. The action calls the shared Axios instance with cookies enabled.
3. Express route guards validate cookies, email verification, role, and request fields.
4. A controller reads/writes Prisma models or calls an external integration.
5. The response is stored in Zustand and rendered by the page/components.

## Execution flow
`ProblemPage` maps the selected language using `frontend/src/lib/utilFunctions.js`, sends all problem test inputs to `/execute-code` or `/execute-code/run`, and the backend submits a Judge0 batch, polls until statuses are no longer queued/running, trims output, compares exact strings, and optionally persists `Submission`, `TestCaseResult`, and `ProblemSolved` rows.
