# Features

| Feature | Main implementation | Status |
|---|---|---|
| Auth and verification | `backend/src/controllers/auth.controllers.js`, `frontend/src/store/useAuthStore.js` | Implemented |
| Problem catalog | `problem.controllers.js`, `ProblemTable.jsx`, `HomePage.jsx` | Implemented |
| Admin problem authoring | `CreateProblemForm.jsx`, `AddProblem.jsx`, `EditProblem.jsx` | Implemented in routes/UI; verify edit/delete UX after changes |
| Code editor | `ProblemPage.jsx`, Monaco, `EditorOptions.js` | Implemented |
| Run without saving | `executeCode.controllers.js:runCode` | Implemented |
| Submit and persist | `executeCode.controllers.js:executeCode` | Implemented |
| Submission details | `SubmissionList.jsx`, `SubmissionResult.jsx` | Implemented |
| Solved tracking | `ProblemSolved`, `/problems/get-solved-problems` | Implemented |
| Playlists | playlist controller/store/modals/profile | Implemented |
| Profile statistics | `Profile.jsx`, `Heatmap.jsx` | Implemented |
| Portfolio | `PortfolioPage.jsx` | Implemented static page |

The older backend README lists some of these as future work even though corresponding code now exists; code and route registration take precedence.
