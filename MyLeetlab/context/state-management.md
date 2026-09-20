# State Management

Zustand stores live in `frontend/src/store` and use the shared Axios instance.

- `useAuthStore`: `authUser`, auth loading flags, `checkAuth`, signup/login/logout.
- `useProblemStore`: problem list/detail, solved problems, loading flags, delete action.
- `useExecuteCodeStore`: execution result and separate `isExecutingCode`/`isRunningCode` flags for submit/run.
- `useSubmissionStore`: current user submissions, per-problem submissions, total and accepted counts, loading flags.
- `usePlaylistStore`: playlist list/detail and playlist CRUD/membership actions.
- `useLeaderboardStore`: `leaderboard` array + `isLeaderboardLoading`; `fetchLeaderboard` (GET `/leaderboard`).
- `useCompanyStore`: `companies` `{id,name}[]` + loading/creating flags; `fetchCompanies` (GET `/companies`), `createCompany(name)` (POST, admin, find-or-create, returns company). Used by the admin problem forms, `ProblemPage` "Asked at", and `ProblemTable` filters.

Stores generally show `react-hot-toast` messages and do not normalize errors into a shared type. New actions should preserve the relevant loading flag in `try/finally`, use optional chaining for error payloads, and update dependent page data after mutations where the current feature expects immediate refresh.

Most transient editor/tab/theme state remains local to `ProblemPage` via React state. Do not move it to Zustand without a cross-page requirement.
