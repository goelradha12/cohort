# Feature-to-Code Map

A cross-reference from each user-visible feature to the exact files that implement it, traced end to end: UI page/component → Zustand store action → Axios path → Express route → controller → data/integration. Use this to jump straight to the layers a change touches. Verified against the code; see the linked per-layer docs for detail.

Legend: FE = frontend, `⟶` = full request path. All API paths are prefixed with `/api/v1`. Backend controller exports live in `backend/src/controllers/`; stores in `frontend/src/store/`.

## Authentication and account

| Feature | FE page/component | Store action | Path | Route → controller |
|---|---|---|---|---|
| Sign up | `page/SignUpPage.jsx` | `useAuthStore.signup` | `POST /auth/register` | `auth.routes.js` → `registerUser` |
| Log in | `page/LoginPage.jsx` | `useAuthStore.login` | `POST /auth/login` | `auth.routes.js` → `loginUser` |
| Auth bootstrap / session check | `App.jsx` (`checkAuth` on mount) | `useAuthStore.checkAuth` | `GET /auth/getProfile` | `auth.routes.js` (`isLoggedIn`) → `getUser` |
| Log out | `components/LogoutButton.jsx`, `Navbar.jsx` | `useAuthStore.logout` | `GET /auth/logout` | `auth.routes.js` → `logOutUser` |
| Verify email | `page/VerifyEmail.jsx` | (direct call / store) | `GET /auth/verifyMail/:token` | `auth.routes.js` → `verifyMail` |
| Resend verification | auth UI | — | `POST /auth/resendVerificationEmail` | `auth.routes.js` → `resendVerificationEmail` |
| Forgot password | `page/ForgotPassword.jsx` | — | `POST /auth/forgotPassword` | `auth.routes.js` → `forgotPasswordRequest` |
| Reset password | `page/ForgotPassword.jsx` | — | `POST /auth/resetPassword/:token` | `auth.routes.js` → `resetPassword` |
| Change password | (account UI) | — | `POST /auth/changePassword` | `auth.routes.js` → `changeCurrPassword` — **route has no `isLoggedIn` guard** |
| Update profile name/image | `page/Profile.jsx` (`handleEditUserName`, `handleEditUserProfile`) | — | `POST /auth/updateProfile` | `auth.routes.js` (`isLoggedIn`, `upload.single('newImage')`) → `updateUserProfile` |
| Refresh access token | Axios flow | — | `GET /auth/refreshAccessToken` | `auth.routes.js` → `refreshAccessToken` |

Guards live in `middlewares/auth.middlewares.js` (`isLoggedIn`, `isVerified`, `checkAdmin`). Tokens/cookies in `utils/generateTokens.js`. Email in `utils/mail.js`. Image upload in `middlewares/multer.middlewares.js` + `middlewares/cloudinary.middleware.js`. Rate limiting on login/register/forgot/reset/resend via `authRateLimiter` (`middlewares/rateLimit.middleware.js`, 10 per 15 min per IP).

## Problems

| Feature | FE page/component | Store action | Path | Route → controller |
|---|---|---|---|---|
| List problems | `page/HomePage.jsx`, `components/ProblemTable.jsx` | `useProblemStore.getAllProblem` | `GET /problems/` | `problem.routes.js` (verified) → `getAllProblems` |
| Problem detail | `page/ProblemPage.jsx` | `useProblemStore.getProblemById` | `GET /problems/:id` | `problem.routes.js` (verified) → `getProblemByID` |
| Solved-problem lookup | `HomePage.jsx` / `Profile.jsx` | `useProblemStore.getSolvedProblemByUser` | `GET /problems/get-solved-problems` | `problem.routes.js` (verified) → `getAllProblemsSolvedByUser` |
| Create problem (admin) | `page/AddProblem.jsx`, `components/CreateProblemForm.jsx` | — | `POST /problems/create-problem` | `problem.routes.js` (`checkAdmin`) → `createProblem` |
| Edit problem (admin) | `page/EditProblem.jsx`, `CreateProblemForm.jsx` | — | `PUT /problems/:id` | `problem.routes.js` (`checkAdmin`) → `updateProblem` |
| Delete problem (admin) | `ProblemTable.jsx` | `useProblemStore.deleteAProblem` | `DELETE /problems/:id` | `problem.routes.js` (`checkAdmin`) → `deleteProblem` |

Problem create/update validated by `validators/problem.validators.js` (`createProblemValidator`); FE form schema in `frontend/src/validators/problemForm.validators.js`. Admin UI gate: `components/AdminRoute.jsx` (not a security boundary — backend `checkAdmin` enforces it).

## Code execution

| Feature | FE page/component | Store action | Path | Route → controller |
|---|---|---|---|---|
| Run code (no persistence) | `page/ProblemPage.jsx` + Monaco (`@monaco-editor/react`), `components/EditorOptions.js` | `useExecuteCodeStore.runCode` | `POST /execute-code/run` | `executeCode.routes.js` (verified) → `runCode` |
| Submit solution (persists) | `page/ProblemPage.jsx` | `useExecuteCodeStore.executeCode` | `POST /execute-code/` | `executeCode.routes.js` (verified) → `executeCode` |
| Result display | `components/SubmissionResult.jsx` | `executionResult` in store | — | — |
| Share problem (copy link) | `page/ProblemPage.jsx` (`handleShare` on the Share2 icon) | — (client-only, copies `window.location.href`, toasts "Problem link copied") | — | — |

Both execution routes are rate-limited by `executionRateLimiter` (`middlewares/rateLimit.middleware.js`, 3/min per user). Judge0 adapter: `libs/judge0lib.js` (language-ID map, batch submit + poll). Judging helpers: `libs/judgeUtils.js` (`SUBMISSION_STATUS` constants, `normalizeOutput`, `outputsMatch`). Execution body validated by `validators/executeCode.validators.js`. Body field names to preserve: `source_code`, `language_id`, `stdin[]`, `expected_outputs[]`, `problemId`. `executeCode` writes `Submission` + `TestCaseResult` and upserts `ProblemSolved` inside a single `db.$transaction`.

## Submissions

| Feature | FE component | Store action | Path | Route → controller |
|---|---|---|---|---|
| All my submissions | `components/SubmissionList.jsx` | `useSubmissionStore.getAllSubmission` | `GET /submission/` | `submission.routes.js` (verified) → `getAllSubmission` |
| My submissions for a problem | `ProblemPage.jsx`, `SubmissionList.jsx` | `useSubmissionStore.getSubmissionByProblemID` | `GET /submission/:problemId` | `submission.routes.js` (verified) → `getSubmissionForProblem` |
| Total submission count | `ProblemPage.jsx` | `useSubmissionStore.getProblemSubCountByAllUser` | `GET /submission/get-submission-count/:problemId` | → `getSubmissionCount` |
| Accepted submission count | `ProblemPage.jsx` | `useSubmissionStore.getSuccessProbSubCountByAll` | `GET /submission/success-submission-count/:problemId` | → `getSuccessfulSubmissionCount` |

Note: the `:problemId` catch-all route is registered last so the specific count routes match first.

## Playlists

| Feature | FE component | Store action | Path | Route → controller |
|---|---|---|---|---|
| List my playlists | `page/Profile.jsx`, `modals/DisplayPlaylistModal.jsx` | `usePlaylistStore.fetchPlaylists` | `GET /playlist` | `playlist.routes.js` (verified) → `getAllListDetails` |
| Playlist detail | `modals/DisplayPlaylistModal.jsx` | `usePlaylistStore.fetchAPlaylist` | `GET /playlist/:playlistId` | → `getPlaylistDetails` |
| Create playlist | `modals/CreatePlaylistModal.jsx` | `usePlaylistStore.createNewPlaylist` | `POST /playlist` | → `createPlaylist` (`createPlaylistValidator`) |
| Edit playlist | `modals/EditPlaylistModal.jsx` | `usePlaylistStore.editAPlaylist` | `PATCH /playlist/:playlistId` | → `editPlaylist` (`createPlaylistValidator`) |
| Delete playlist | `modals/DisplayPlaylistModal.jsx` | `usePlaylistStore.deleteAPlaylist` | `DELETE /playlist/:playlistId` | → `deletePlaylist` |
| Add problem to playlist | `modals/AddToPlaylistModal.jsx` (opened from `ProblemTable.jsx` and from the Bookmark icon in `page/ProblemPage.jsx`) | `usePlaylistStore.addProblemToPlaylist` (body `problemIds`) | `POST /playlist/:playlistId/add-problem` | → `addProblemToPlaylist` (`addProblemToPlaylistValidator`) |
| Remove problem from playlist | `modals/DisplayPlaylistModal.jsx` | `usePlaylistStore.removeProblemFromPlaylist` | `PATCH /playlist/:playlistId/remove-problem` | → `removeProblemFromPlaylist` (`removeProblemFromPlaylistValidator`) |

Playlist validators: `validators/playlist.validators.js`. All playlist routes are `isLoggedIn` + `isVerified`.

## Profile, stats, and static pages

| Feature | FE page/component | Notes |
|---|---|---|
| Profile summary + heatmap | `page/Profile.jsx`, `components/Heatmap.jsx` | Composes auth user, solved problems, submissions, and playlists from the stores above. `Profile.jsx` calls `playlist.description.slice(...)` — field is nullable (see known-issues). |
| Leaderboard (solved-count ranking) | `page/Leaderboard.jsx`, `store/useLeaderboardStore.js` → `GET /leaderboard` → `leaderboard.controllers.js` `getLeaderboard` | Public to all verified users; route `/leaderboard` (Navbar link); highlights the current user. |
| Developer portfolio | `page/PortfolioPage.jsx` | Static content with external links/assets; not backend-managed. Route `/developer-portfolio`. |
| Not found | `page/PageNotFound.jsx` | `*` redirects to `/404-page-not-found`. |
| Theme toggle | `components/ThemeToggleButton.jsx` | DaisyUI theme switch. |
| Shared layout / nav | `layout/Layout.jsx`, `components/Navbar.jsx` | Authenticated shell. |

## Cross-cutting entry points
- FE route table + auth redirects: `frontend/src/App.jsx`.
- Axios instance (base URL + `withCredentials`): `frontend/src/lib/axios.js`.
- Language/util helpers: `frontend/src/lib/utilFunctions.js`.
- Express bootstrap + API prefixes + CORS: `backend/src/index.js`.
- Prisma client: `backend/src/libs/db.js`; schema: `backend/prisma/schema.prisma`.
- Response/error wrappers: `backend/src/utils/api.response.js`, `api.error.js`, `async-handler.js`; global error handler `backend/src/middlewares/error.middleware.js` (registered last in `index.js`).

## How to use this map
1. Find the feature row.
2. Open the FE component and its store action to change UI/client behavior.
3. Follow the path to the route + controller for server behavior.
4. Check the referenced validator before renaming any request field.
5. For data-shape changes, also open `database.md` and every consumer listed here so frontend and backend contracts stay aligned.

Keep this file in sync when a route, store action, page, or controller is added or renamed. Related docs: [api-documentation.md](api-documentation.md), [frontend.md](frontend.md), [state-management.md](state-management.md), [backend.md](backend.md), [business-logic.md](business-logic.md).
