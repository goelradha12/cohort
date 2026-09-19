# Testing

## Present infrastructure
No test files, test runner configuration, coverage configuration, or package test scripts were found in the repository. The available executable checks are frontend ESLint (`npm run lint`) and Vite build (`npm run build`). The current frontend build passes. ESLint currently exits with 10 unused-variable errors and 12 React hook dependency warnings in existing application files; this documentation task did not change those files. Backend runtime behavior must currently be checked through local integration/manual requests.

## Recommended coverage gaps
- Auth cookie issuance, expiry, verification, password reset, and role guards.
- Problem CRUD authorization and validator shapes.
- Judge0 result mapping, compile/runtime errors, empty stdout, and polling failure/timeouts.
- Submission persistence atomicity between Submission and TestCaseResult.
- Playlist ownership and duplicate membership constraints.
- Frontend redirects, loading states, store error handling, and editor submission payloads.

When adding tests, keep route/controller tests independent of real secrets and external services by mocking Prisma, Judge0, SMTP, Cloudinary, and Axios.
