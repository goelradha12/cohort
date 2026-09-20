# Remediation Plan

Open, prioritized work derived from code review and verified against the current code. Each item lists severity, root cause, the files to change, and a concrete fix. Completed items have been removed from this plan and recorded under "Recently completed" at the bottom, with details tracked in [known-issues-and-limitations.md](known-issues-and-limitations.md).

Severity scale: **P1** correctness or security gap, **P2** robustness/operational, **P3** hygiene/cleanup.

> **Note on password hashing**: `backend/src/libs/db.js` registers a global Prisma middleware `hashPassword` that bcrypt-hashes `data.password` on every `User` `create`/`update`. Password *storage* is handled centrally. Controllers must **not** hash again (double-hash breaks login).

---

## P2 — Robustness and operations

### Judge0 polling has no timeout or backoff — ✅ DONE (backoff 0.5s→3s, ~60s cap, 504/502 apiError)
- **Files**: `backend/src/libs/judge0lib.js` (`pollBatchResults`).
- **Root cause**: `while (true)` with a fixed 1s sleep loops forever if Judge0 never finishes, tying up the request.
- **Fix**: Add a max-attempts / max-elapsed-time cap, throw an `apiError` (e.g. 504) on timeout, and use incremental backoff instead of a flat 1s. Guard the network calls so a Judge0 error surfaces as a clean API error.
- **Verify**: point `JUDGE0_URL` at an unresponsive endpoint and confirm the request fails cleanly within the cap.

### Defensive rendering for nullable playlist description
- **Files**: `frontend/src/page/Profile.jsx`.
- **Root cause**: Calls `playlist.description.slice(...)` while `Playlist.description` is nullable in Prisma; a null description throws at render.
- **Fix**: Guard with `playlist.description?.slice(...)` and a fallback (empty string or placeholder).
- **Verify**: render a playlist created without a description.

### Secure cookie / CORS policy (remainder of the rate-limiting item)
- **Files**: `backend/src/index.js`, cookie settings in `utils/generateTokens.js` / auth controllers.
- **Root cause**: Cookie `secure`/`sameSite` behavior depends on the local environment; CORS allows only `BASE_URL` + localhost.
- **Fix**: Set `secure`/`httpOnly`/`sameSite` cookie flags per environment. Align CORS `origin` with the chosen production origin. When deployed behind a reverse proxy, set `app.set('trust proxy', 1)` so `req.ip` (used by the auth rate limiter) reflects the real client IP. Pair this with the deployment-topology decision (see the API base URL note under "Recently completed").
- **Verify**: confirm cookie flags and CORS behavior in a production-like config.

---

## P3 — Hygiene and project setup

### No automated tests or CI
- **Files**: new `backend` test setup and optional CI workflow.
- **Status**: Backend linting and Docker packaging are now present.
- **Fix**: Add a test runner (e.g. Vitest/Jest) covering auth guards, validators, Judge0 language mapping, `outputsMatch`, and playlist ownership. Add CI to run frontend/backend lint, build, Prisma validation, and tests.
- **Verify**: checks run green locally and in CI.

### Sensitive/debug logging in runtime code
- **Status**: Frontend debug logs were removed and Judge0/server startup messages are development-gated.
- **Files**: backend controllers and middleware still contain diagnostic error logs.
- **Fix**: Centralize server logging before production and ensure no tokens/passwords/PII are logged.
- **Verify**: confirm production logs contain only approved operational fields.

### Hard-coded, auto-running admin seed (`createAdmin.js`) — ✅ DONE (file removed)
- The hard-coded seed script was deleted (it was never imported). To create an admin, set `User.role = ADMIN` directly, or add an env-driven, idempotent seed script later if desired (`ADMIN_EMAIL`/`ADMIN_PASSWORD` are stubbed in `backend/.env.example`).

### `changeCurrPassword` hardening (low priority, not exploitable)
- **Files**: `backend/src/controllers/auth.controllers.js`, `backend/src/routes/auth.routes.js`.
- **Reassessment**: requires the correct `oldPassword` (verified via `bcrypt.compare`), so it is not a privilege-escalation vulnerability — just a design inconsistency.
- **Fix**: Add `isLoggedIn` to the route and derive the account from `req.user`, ignoring any body `email`. Keep writing plaintext `newPassword` (the middleware hashes it). Optionally rotate the refresh token.
- **Verify**: change password while logged in; confirm the new password works, the old fails, and a logged-out request is rejected.

### Review access control for reference solutions and ownership queries — ✅ reference solutions DONE (gated to admin/solver; list strips them). Playlist/profile ownership audit still open.
- **Files**: `backend/src/controllers/problem.controllers.js` (`getProblemByID`), playlist and profile controllers.
- **Root cause**: `Problem.referenceSolutions` may be returned to non-admin users; playlist/profile queries should confirm they scope to the requesting user.
- **Fix**: Strip `referenceSolutions` (and other admin-only fields) from non-admin problem responses; audit each playlist/submission query to ensure it filters by `req.user` ownership.
- **Verify**: fetch a problem as a normal user and confirm reference solutions are absent; attempt cross-user playlist access and confirm it is denied.

### Cloudinary public-ID robustness (follow-up to the avatar fix)
- **Files**: `backend/src/middlewares/cloudinary.middleware.js`.
- **Context**: `getCloudinaryPublicId` now parses folder-aware public IDs, but the app currently uploads without an explicit `folder`/`public_id`, so uploads land at the account root. If a folder or transformation strategy is later adopted, revisit the parser and the upload options together.
- **Verify**: upload, replace, and confirm the previous image is deleted for both root and foldered assets.

---

## Suggested order for remaining work
1. Judge0 polling timeout/backoff (P2 resilience — the main gap left in the execution path).
2. Nullable playlist description guard (quick P2 frontend safety fix).
3. Secure cookie/CORS policy + `trust proxy`, alongside the deployment-topology decision.
4. P3 cleanup: tests/CI, centralized backend logging, admin seed, `changeCurrPassword` hardening, access-control audit.

---

## Recently completed (kept for reference)
- **Avatar upload fixes**: guarded `req.file` access (name-only updates no longer crash), null-safe old-image deletion (first upload no longer crashes), folder-aware `getCloudinaryPublicId`, and the frontend now uses the browser-native `FormData` (removed the Node `form-data` import) with an empty-file guard.
- **Transactional submission**: `executeCode` wraps submission + solved-marker + testcase writes in `db.$transaction`.
- **Canonical status constants**: `SUBMISSION_STATUS` in `judgeUtils.js`; values kept `ACCEPTED`/`WRONG ANSWER` (frontend compares and renders them).
- **Robust output comparison**: `outputsMatch`/`normalizeOutput` in `judgeUtils.js` (CRLF normalize, per-line trailing-whitespace strip, trailing-blank drop, single-token numeric tolerance).
- **Frontend error safety + global error handler**: stores use optional chaining; `middlewares/error.middleware.js` renders forwarded errors as JSON, registered last in `index.js`.
- **Explicit production API base URL**: `axios.js` resolves `VITE_API_URL` first, then dev localhost, then `/api/v1`.
- **Rate limiting**: `express-rate-limit` in `middlewares/rateLimit.middleware.js` — execution 3/min per user, auth-sensitive 10 per 15 min per IP.
- **`.env.example`**: added for backend and frontend with placeholders only.
