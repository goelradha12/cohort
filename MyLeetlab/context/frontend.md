# Frontend

## Routing
Routes are declared in `frontend/src/App.jsx`: `/`, `/profile`, `/leaderboard`, `/login`, `/signup`, `/forgot-password`, `/verify-email`, `/problem/:id`, `/add-problem`, `/edit-problem/:id`, `/developer-portfolio`, and `/404-page-not-found`. The admin routes are nested under `AdminRoute`; the root and problem routes use auth redirects.

## Page ownership
- `HomePage.jsx`: problem catalog and solved indicators.
- `ProblemPage.jsx`: problem statement, Monaco editor, execution, tabs, stats, and result display.
- `Profile.jsx`: account information, submission summary, heatmap, and playlists.
- `AddProblem.jsx`/`EditProblem.jsx`: admin problem forms.
- Auth pages: login, signup, forgot password, and email verification.
- `PortfolioPage.jsx`: static developer portfolio content.

## Reusable surfaces
`Navbar` and `Layout` provide authenticated navigation. `ProblemTable`, `SubmissionList`, `SubmissionResult`, `Heatmap`, and playlist modals encapsulate repeated workflows. `ThemeToggleButton` controls DaisyUI theme behavior. `AuthImagePattern` is used by auth UI.

## Client API convention
Use `axiosInstance` from `frontend/src/lib/axios.js`; it already sets the API base URL and `withCredentials`. Stores generally own async calls, loading booleans, toast errors, and response state. Avoid calling the backend directly from new page components unless the surrounding feature already does so.

## Form convention
Auth and problem forms use React Hook Form/Zod validators in `frontend/src/validators`. Preserve the server's field names and JSON shapes when changing form schemas.
