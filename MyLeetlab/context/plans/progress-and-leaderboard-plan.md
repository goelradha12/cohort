# Plan: User Progress Visibility & Leaderboard

Status: **Phase 1 implemented** — a public solved-count leaderboard is live. Decisions taken: solved count only, real names, ~100-150 users (on-demand aggregation, no caching), public to all verified users. Admin-specific report and richer stats (difficulty/accuracy/points) remain future options below.

## Implemented (Phase 1)
- Backend: `GET /api/v1/leaderboard` (`isLoggedIn` + `isVerified`) in `leaderboard.controllers.js` / `leaderboard.routes.js`, mounted in `index.js`. Aggregates `ProblemSolved` via Prisma `groupBy`, joins `User` for `name`/`image` (no PII), ranks by solved count (equal counts share a rank).
- Frontend: `useLeaderboardStore` (`fetchLeaderboard`), `page/Leaderboard.jsx` (ranked DaisyUI table, current user highlighted with a "You" badge), route `/leaderboard` in `App.jsx` (under `Layout`, auth-guarded), and a Navbar dropdown link.

The rest of this document is retained as the design record and future roadmap.

---


## Goal (as stated)
Two overlapping asks:
1. **Admin view of user progress** — who solved how many problems (admin-only oversight).
2. **Leaderboard** — everyone can see each other's progress (social/competitive).

These are different in audience and privacy scope, so the plan treats them as two features that share most of the backend.

---

## What already exists (grounding)
- **Data model** (`prisma/schema.prisma`):
  - `User` (id, name, email, image, role `USER|ADMIN`, isEmailVerified, createdAt) with relations `submission[]`, `problemSolved[]`, `playlists[]`.
  - `ProblemSolved` — unique `(userId, problemId)`; the cleanest source of "solved count".
  - `Submission` — has `status` (`ACCEPTED`/`WRONG ANSWER`), `createdAt`, `problemId`, `userId`.
- **Aggregate patterns already used** (`submission.controllers.js`): `db.Submission.count({ where })`, and `db.ProblemSolved.findMany({ where, include:{ problem:true } })`. The Profile page already derives per-user correct/wrong counts and a heatmap from a user's own submissions.
- **Guards** (`auth.middlewares.js`): `isLoggedIn` (sets `req.user`), `isVerified`, `checkAdmin` (verified + `role === ADMIN`). These are the building blocks for access control.
- **Conventions**: routes → controllers returning `apiResponse`, Zustand stores calling `axiosInstance`, DaisyUI tables (see `ProblemTable.jsx`, `Profile.jsx`).

**Key metric definition**: "problems solved" = count of `ProblemSolved` rows per user (already unique per problem). "Attempts/accuracy" can come from `Submission` counts by status. Both are cheap to aggregate.

---

## The design decisions (the "all the ways")

### A. What data to show
Options, cheapest first:
1. **Solved count only** — `ProblemSolved` grouped by user. Simplest, unambiguous.
2. **Solved + attempts + accuracy** — add `Submission` counts (total, accepted) per user. Richer, still cheap.
3. **Solved broken down by difficulty** — join `ProblemSolved → Problem.difficulty`, count EASY/MEDIUM/HARD. Most "LeetCode-like".
4. **Points/score** — weight solved problems by difficulty (e.g. EASY 1, MEDIUM 3, HARD 5). Enables a truer ranking but introduces a scoring policy to maintain.
5. **Recent activity / streaks** — derive from `Submission.createdAt` (the Profile heatmap already does date bucketing). Nice-to-have, heavier.

Recommendation: start with **(1)+(2)+(3)** — solved count, accuracy, and difficulty breakdown. Defer points/streaks to a later pass.

### B. How to compute it (query strategy)
1. **On-demand aggregation (recommended to start)** — a single endpoint runs `groupBy`/`count` at request time.
   - Prisma: `db.problemSolved.groupBy({ by: ['userId'], _count: { _all: true } })`, then fetch matching users, and optionally `submission.groupBy` for accuracy. Difficulty breakdown needs either a grouped query joined to `Problem` or a raw SQL aggregate.
   - Pros: zero schema change, always accurate. Cons: cost grows with users×submissions; fine for a class-sized cohort, not for very large scale.
2. **Precomputed/cached** — maintain a denormalized `solvedCount` (and score) on `User`, updated in the existing `executeCode` transaction whenever a `ProblemSolved` is created.
   - Pros: leaderboard reads become a trivial `orderBy`. Cons: schema migration + must keep the counter correct (the transaction from remediation item 3 is the right place).
3. **Materialized view / scheduled job** — overkill for current scale; note for the future only.

Recommendation: **(1) on-demand** now (add pagination + a short in-memory cache if needed). Revisit **(2)** only if the cohort grows large; it pairs naturally with the points option.

### C. Access model (admin vs public leaderboard)
1. **Admin-only progress report** — new endpoint behind `checkAdmin`; can include emails and per-user detail. This satisfies ask #1.
2. **Public (authenticated) leaderboard** — endpoint behind `isLoggedIn` + `isVerified`; must **not** leak emails or other PII. Show name (or a display handle) + stats only. This satisfies ask #2.
3. **Both, one endpoint with role-aware payload** — single endpoint that returns extra fields (email, verified status) only when `req.user` is admin. Fewer endpoints, but mixes concerns and is easier to get wrong on privacy.

Recommendation: **two endpoints** (2 for everyone, 1 for admin) sharing one aggregation helper. Clear privacy boundary, matches the existing guard-composition style.

**Privacy note**: the leaderboard exposes user activity to all users. Options to soften: show first name / display name only, allow an opt-out flag on `User`, or rank by handle. At minimum, never return `email` on the public endpoint. Flag this for a product decision.

### D. Frontend surface
1. **New `/leaderboard` route + page** — a ranked DaisyUI table (rank, avatar+name, solved, difficulty split, accuracy). Add a Navbar link. Reachable by all authenticated users.
2. **Admin section** — either a dedicated `/admin/users` page (richer, admin-only, behind the existing `AdminRoute`) or an admin-only column/tab on the leaderboard.
3. **Reuse existing pieces** — the Profile page's stat tables and the `ProblemTable` pagination/search patterns transfer directly; no new UI system needed.

Recommendation: ship **(1)** for everyone first, then **(2)** as an admin page under `AdminRoute` reusing the same store data plus admin-only fields.

---

## Recommended approach (concrete)

### Backend
- **New controller** `leaderboard.controllers.js` (or add to `submission.controllers.js`) with a shared aggregation helper:
  - `getLeaderboard` — for all verified users. Returns ranked rows: `{ userId, name, image, solvedCount, easy, medium, hard, totalSubmissions, acceptedSubmissions }`. No email.
  - `getUserProgressAdmin` — behind `checkAdmin`. Same rows plus `email`, `isEmailVerified`, `role`, and optionally per-user drill-down.
- **Queries**: use Prisma `groupBy`/`count` (matches existing style). Difficulty breakdown via a grouped query joined to `Problem`, or a single `$queryRaw` aggregate if the grouped approach gets awkward — decide during implementation.
- **Routes**: new `leaderboard.routes.js` mounted at `/api/v1/leaderboard`.
  - `GET /leaderboard` → `isLoggedIn, isVerified, getLeaderboard`.
  - `GET /leaderboard/admin` (or `/admin/users`) → `isLoggedIn, checkAdmin, getUserProgressAdmin`.
  - Support `?limit=&offset=` (or page params) and a default sort by solvedCount desc, tie-broken by acceptedSubmissions or earliest solve.
- **Responses** in the `apiResponse` wrapper, consistent with every other controller.

### Frontend
- **New store** `useLeaderboardStore.js` (Zustand + `axiosInstance`), with `fetchLeaderboard()` and `fetchAdminUserProgress()`, loading flags, and safe `error?.response?.data?.message` handling (matches the hardened stores).
- **New page** `page/Leaderboard.jsx` — ranked table, current user highlighted, difficulty columns, accuracy. Add a Navbar entry and a route in `App.jsx` guarded by `authUser` like other protected routes.
- **Admin page** `page/AdminUsers.jsx` under the existing `AdminRoute` nesting in `App.jsx`, reusing the store but calling the admin endpoint; adds email/verified columns and optional search.

### Docs to update when built
`api-documentation.md`, `feature-code-map.md`, `state-management.md`, `frontend.md`, `backend.md`, and this file's status.

---

## Effort & sequencing
1. Backend aggregation helper + `GET /leaderboard` (public, no PII) + store + `/leaderboard` page. — core value, low risk.
2. Admin endpoint (`checkAdmin`) + admin users page under `AdminRoute`. — satisfies the admin ask.
3. Difficulty breakdown and accuracy columns. — richer stats.
4. Optional later: points/scoring, streaks, denormalized `solvedCount` cache + pagination hardening, leaderboard privacy opt-out.

## Open questions for you
1. **Leaderboard visibility** — truly public to all logged-in users, or admin-only? (Drives whether we build one endpoint or two.)
2. **Ranking metric** — solved count only, or difficulty-weighted points? (Points needs a scoring policy.)
3. **PII/privacy** — okay to show real names on the shared leaderboard, or prefer a display handle / opt-out?
4. **Scale** — rough number of users expected? (Decides on-demand vs. cached counters.)
5. **Scope now** — do you want me to start with the public leaderboard, the admin report, or both?
