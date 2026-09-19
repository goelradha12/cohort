# Project Overview

## Product
MyLeetlab is a LeetCode-style coding practice application with an administrator-managed problem catalog and a Judge0-backed execution service.

## Personas
- **USER**: must authenticate and verify email before accessing the protected problem, submission, playlist, and profile APIs.
- **ADMIN**: a verified user with `User.role = ADMIN`; can create, update, and delete problems.

## Implemented scope
- Registration, login, logout, profile lookup, profile update, email verification, resend verification, forgot/reset password, and change password.
- Problem listing, detail view, solved-problem lookup, admin problem creation/edit/deletion.
- Monaco editor with supported language snippets and editor themes.
- Test execution without persistence and solution submission with persistence.
- Judge0 batch execution and per-testcase result storage.
- Submission history, problem submission counts, success counts, and profile summary/heatmap.
- Playlist creation, editing, deletion, detail lookup, and problem membership changes.
- Developer portfolio and not-found routes.

## Repository status
The code is an active application rather than a packaged deployment. There are no visible automated tests, CI workflows, Docker files, or deployment manifests. Some README entries describe future work; see [roadmap-and-todos.md](roadmap-and-todos.md).
