# Business Logic

## Problem representation
A problem has a difficulty enum, tags, examples, constraints, optional hints/editorial, testcases, language snippets, and reference solutions. The form currently requires JavaScript, Python, and Java examples/snippets/reference solutions, while the backend schema stores these as JSON.

## Execution and acceptance
Each test input is sent as one Judge0 submission. A testcase passes when its output matches the expected output via `outputsMatch` in `backend/src/libs/judgeUtils.js` — a normalized comparison (CRLF→LF, per-line trailing-whitespace strip, trailing-blank-line drop) with a numeric-tolerance fallback for single-token numbers (so `0.5` == `0.50`). `allPassed` controls the persisted status, taken from the `SUBMISSION_STATUS` constants (`ACCEPTED` or `WRONG ANSWER`). In `executeCode`, the submission row, the `ProblemSolved` upsert (composite unique key), and the `TestCaseResult` rows are written inside a single `db.$transaction`, so a failure cannot leave partial data. `runCode` performs the same comparison but persists nothing.

## Visibility rules
Reference solutions are rendered in the problem page but are only loaded into the editor when the current user has a solved marker for that problem. API-level protection for reference solution contents is not independently established; verify controller payloads before treating this as a security boundary.

## Ownership
User, problem, submission, and playlist relations are stored in Prisma. Playlist names are unique per user, and a problem can occur once per playlist. Cascade deletes remove dependent submissions, solved markers, and playlist links when parent records are deleted.

## Statistics
Problem page uses total submission count and accepted submission count to calculate a displayed success rate. Profile counts derive from fetched user submissions and solved rows. Heatmap dates derive from submission timestamps in frontend code.
