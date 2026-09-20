# Business Logic

## Problem representation
A problem has a difficulty enum, tags, examples, constraints, optional hints/editorial, testcases, language snippets, and reference solutions, all stored as JSON. `examples`, `codeSnippets`, and `referenceSolutions` are objects keyed by language.

## Multi-language support
A problem supports any non-empty subset of the backend's supported languages (C, CPP, PYTHON, JAVA, JAVASCRIPT). The admin form is dynamic: add/remove languages, each with its own snippet/reference-solution/example (keyed independently — editing one never overwrites another). The supported-language list comes from `GET /languages`, which derives from `backend/src/libs/judge0lib.js` (`LANGUAGES`/`getJudge0LanguageID`/`getLanguageName`) — the single source of truth. Backend validates ≥1 language, supported keys only (400 otherwise), and snippet↔solution alignment. Monaco editor language is mapped via `getMonacoLanguage` (e.g. `CPP`→`cpp`). Existing JS/PY/JAVA problems are unaffected (no migration).

## Execution and acceptance
Each test input is sent as one Judge0 submission. A testcase passes when its output matches the expected output via `outputsMatch` in `backend/src/libs/judgeUtils.js` — a normalized comparison (CRLF→LF, per-line trailing-whitespace strip, trailing-blank-line drop) with a numeric-tolerance fallback for single-token numbers (so `0.5` == `0.50`). `allPassed` controls the persisted status, taken from the `SUBMISSION_STATUS` constants (`ACCEPTED` or `WRONG ANSWER`). In `executeCode`, the submission row, the `ProblemSolved` upsert (composite unique key), and the `TestCaseResult` rows are written inside a single `db.$transaction`, so a failure cannot leave partial data. `runCode` performs the same comparison but persists nothing.

## Visibility rules
Reference solutions are protected at the API layer (not just the UI): `getProblemByID` reveals the actual solution code only to admins or users who have a `ProblemSolved` marker for that problem. For everyone else, the `referenceSolutions` language keys are preserved (so the UI can still show which languages have a solution, locked) but the code strings are returned as `null`. `getAllProblems` strips `referenceSolutions` from the list entirely. The frontend loads solution code into the editor only when `isProblemSolved`, which matches the API gating.

## Execution resilience
`pollBatchResults` (`judge0lib.js`) is bounded: it polls Judge0 with incremental backoff (0.5s → 3s cap) and gives up after ~60s, throwing `apiError(504)` on timeout and `apiError(502)` if the Judge0 request itself fails. These propagate through the `executeCode`/`runCode` catch blocks as clean JSON errors instead of hanging the request.

## Ownership
User, problem, submission, and playlist relations are stored in Prisma. Playlist names are unique per user, and a problem can occur once per playlist. Cascade deletes remove dependent submissions, solved markers, and playlist links when parent records are deleted.

## Statistics
Problem page uses total submission count and accepted submission count to calculate a displayed success rate. Profile counts derive from fetched user submissions and solved rows. Heatmap dates derive from submission timestamps in frontend code.
