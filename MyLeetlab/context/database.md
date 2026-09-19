# Database

Prisma schema: `backend/prisma/schema.prisma`. Provider: PostgreSQL. URLs are `DATABASE_URL` and `DIRECT_URL`.

## Models
- `User`: identity, password hash, role, verification/reset tokens, refresh token, and relations.
- `Problem`: title/description/difficulty/tags, author, JSON examples/testcases/snippets/reference solutions, constraints, hints/editorial.
- `Submission`: user/problem, source code JSON, language/status, serialized execution fields.
- `TestCaseResult`: one row per executed testcase, linked to a submission.
- `ProblemSolved`: unique `(userId, problemId)` solved marker.
- `Playlist`: user-owned named collection; unique `(userId, name)`.
- `ProblemPlaylist`: join table; unique `(playlistId, problemId)`.

All main foreign keys use cascade delete. `TestCaseResult.submissionId` is indexed. `Difficulty` is `EASY | MEDIUM | HARD`; `UserRole` is `ADMIN | USER`.

## JSON and serialization notes
`Problem.examples`, `testcases`, `codeSnippets`, and `referenceSolutions` are JSON. `Submission.sourceCode` is JSON even though execution sends a string. `Submission.stdout`, `stderr`, `compileOutput`, `memory`, and `time` are strings containing serialized arrays in execution code. `SubmissionResult.jsx` parses the memory/time strings.

## Migration history
Migrations create users, add verification/reset fields, add problems, add submission/solved models, add playlists, correct the `ProblemPlayist` typo to `ProblemPlaylist`, and rename `Problem.editor` to `Problem.editorial`. The typo migration warns that the old join-table data would be dropped; preserve this history when diagnosing existing databases.

Use Prisma migrations rather than editing generated client output. The repository does not document production migration commands beyond the standard Prisma tooling; verify the target environment before applying schema changes.
