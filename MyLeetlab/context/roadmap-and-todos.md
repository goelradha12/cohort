# Roadmap and TODOs

## Explicitly noted in the existing backend README
The README lists these as future work or follow-up ideas: count passed testcases, separate run and submit behavior, show already-solved state, store execution status in an enum, show aggregate successful-submission percentages, complete frontend auth, and handle admin edit/delete routes.

Several items now appear implemented in code: separate `/execute-code/run`, solved tracking, aggregate submission endpoints, frontend auth pages, and admin edit/delete routes. Verify behavior and update this document when those paths change.

## Current follow-up candidates derived from code review
See [remediation-plan.md](remediation-plan.md) for the full, prioritized version with a status snapshot.

Resolved:
- ✅ Make submission persistence transactional (`db.$transaction` in `executeCode`).
- ✅ Robust output comparison for LeetCode-style output (`judgeUtils.js`).
- ✅ Align frontend/backend error contracts and harden network-error handling (store optional chaining + global Express error handler).
- ✅ Explicit production API base URL (`VITE_API_URL`).
- ✅ Sanitized `.env.example` for backend and frontend.
- ✅ Rate limiting (execution 3/min per user, auth 10 per 15 min per IP).

Still open:
- Add automated unit/integration tests around auth, guards, validators, execution mapping, and playlist ownership.
- Add Judge0 timeout/error handling and a bounded polling strategy.
- Remove seed credentials from source and add a secure, explicit admin bootstrap process.
- Document deployment/migration operations.
- Review access control for reference solutions and all profile/playlist ownership queries.
- Add secure cookie/CORS policy (and `trust proxy` when deployed) plus optional observability.

These are recommendations, not claims that the repository already plans them.
