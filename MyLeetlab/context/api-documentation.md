# API Documentation

Base URL: `/api/v1`. All protected endpoints authenticate with the `accessToken` cookie. Unless noted, protected problem, execution, submission, and playlist endpoints also require verified email.

## Authentication
| Method | Path | Guard | Purpose |
|---|---|---|---|
| POST | `/auth/register` | validation | Create user and send verification mail |
| GET | `/auth/verifyMail/:token` | none | Verify email token |
| POST | `/auth/login` | validation | Authenticate and issue cookies |
| POST | `/auth/changePassword` | route currently has no auth guard | Change current password; verify controller behavior before relying on this |
| POST | `/auth/resendVerificationEmail` | validation | Send a new verification mail |
| POST | `/auth/forgotPassword` | validation | Start password reset |
| POST | `/auth/resetPassword/:token` | validation | Reset password |
| GET | `/auth/getProfile` | `isLoggedIn` | Return current user |
| GET | `/auth/logout` | none | Clear/logout session |
| GET | `/auth/refreshAccessToken` | none | Refresh access token |
| POST | `/auth/updateProfile` | `isLoggedIn`, multipart image optional | Update profile and upload image |

## Problems
| Method | Path | Guard | Purpose |
|---|---|---|---|
| GET | `/problems/` | logged in + verified | List problems |
| POST | `/problems/create-problem` | logged in + admin | Create problem |
| GET | `/problems/get-solved-problems` | logged in + verified | Current user's solved rows |
| GET | `/problems/:id` | logged in + verified | Problem detail |
| PUT | `/problems/:id` | logged in + admin | Update problem |
| DELETE | `/problems/:id` | logged in + admin | Delete problem |

## Execution
| Method | Path | Guard | Required body |
|---|---|---|---|
| POST | `/execute-code/` | logged in + verified + validation | `source_code`, `language_id`, `stdin[]`, `expected_outputs[]`, `problemId` |
| POST | `/execute-code/run` | same | Same fields |

`stdin` and `expected_outputs` must be nonempty arrays of equal length. Submit persists records; run returns the execution result without saving it.

## Submissions
- `GET /submission/`: current user's submissions.
- `GET /submission/:problemId`: current user's submissions for a problem.
- `GET /submission/get-submission-count/:problemId`: aggregate submission count.
- `GET /submission/success-submission-count/:problemId`: accepted count.

## Playlists
- `GET /playlist`: list current user's playlists.
- `POST /playlist`: create playlist (`name`, optional `description` per validator).
- `GET /playlist/:playlistId`: detail.
- `PATCH /playlist/:playlistId`: edit.
- `DELETE /playlist/:playlistId`: delete.
- `POST /playlist/:playlistId/add-problem`: add `problemIds` according to playlist validator.
- `PATCH /playlist/:playlistId/remove-problem`: remove membership according to validator.

## Leaderboard
- `GET /leaderboard`: logged in + verified. Public solved-count ranking of all users. Returns an array of `{ userId, name, image, solvedCount, rank }` sorted by `solvedCount` desc; equal counts share a rank. No email/PII. Solved count is aggregated on demand from `ProblemSolved` (fine at ~100-150 users).

## Languages
- `GET /languages`: logged in. Returns the backend-supported languages `{ key, id, label, monaco }[]` derived from `judge0lib.js` (the single source of truth): C (50), CPP (54), PYTHON (71), JAVA (62), JAVASCRIPT (63). The admin problem form's language selector consumes this; the frontend must not maintain a separate list.

Problem language fields: `codeSnippets`, `referenceSolutions`, and `examples` are JSON objects keyed by these language keys. A problem supports any non-empty subset (one or more). `createProblem`/`updateProblem` require ≥1 language, reject unsupported keys with 400, require each `codeSnippets` language to have a matching `referenceSolution`, and execute every reference solution through Judge0 before saving.

## Companies
- `GET /companies`: logged in + verified. Returns the canonical company list `{ id, name }` sorted by name. Used to build the companyId→name map for display and filter options.
- `POST /companies`: logged in + admin + validation. Body `{ name }`. Normalizes the name (trim, lowercase, collapse whitespace) and find-or-creates by `normalizedName`, so "Google"/"google"/" GOOGLE " resolve to one company. Returns the existing record (200) or the newly created one (201). No delete endpoint.

Problem `companies` field: `Problem.companies` is an optional JSON array of `{ companyId, year, context }` (all three required per entry; the array itself is optional — null/absent means none). There is no DB foreign key; `createProblem`/`updateProblem` verify every `companyId` exists in the `Company` table and return 400 if any is unknown. On update, `companies` is written only when the field is present in the body (`undefined` leaves the existing value untouched; `[]` explicitly clears it).

## Response caveat
Exact controller messages and nested payload shapes should be read from the controller before building a new consumer. The standard wrapper is `apiResponse`; execution returns `data.submission` and `data.TestCaseResult`.
