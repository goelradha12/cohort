# Application Flow

## Browser startup
`main.jsx` renders `App` inside `StrictMode` and `BrowserRouter`. `App` calls `useAuthStore.checkAuth()` on mount. Until the check completes, it shows a loader when there is no user. Protected routes redirect unauthenticated users to `/login`; unknown routes redirect to `/404-page-not-found`.

## Registration and login
Registration posts form data to `/auth/register`; the backend creates a user and sends a verification email. Login posts to `/auth/login`; the backend sets access/refresh cookies and returns a user payload. Subsequent Axios requests include cookies through `withCredentials: true`.

## Solve a problem
1. Home loads `/problems/` into `useProblemStore`.
2. `/problem/:id` loads detail, code snippets, testcases, submissions, aggregate counts, and solved status.
3. The user selects a language/theme and edits Monaco content.
4. **Test Code** calls `/execute-code/run`; results are shown without database persistence.
5. **Submit Solution** calls `/execute-code`; all testcases run through Judge0. A full pass creates a submission, testcase rows, and an idempotent solved row.
6. The page can show the submission result, history, hints, and gated reference solutions.

## Admin problem flow
`AdminRoute` checks the client user role. The backend independently applies `checkAdmin` to create/update/delete endpoints. `CreateProblemForm` validates structured JSON-like problem fields with Zod before sending them to the API.

## Profile and playlists
`Profile` loads submissions, solved problems, and playlists. Playlist modals call the playlist store for CRUD and membership changes. The profile renders aggregate submission counts and a date-based heatmap.
