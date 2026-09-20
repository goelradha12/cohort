# Testing

## Present infrastructure
No test files, test runner configuration, or coverage configuration were found in the repository. Frontend ESLint (`npm run lint`) and Vite build (`npm run build`) are available. Backend ESLint is available through `npm run lint` from `backend/`; backend runtime behavior must currently be checked through local integration/manual requests.

## Recommended coverage gaps
- Auth cookie issuance, expiry, verification, password reset, and role guards.
- Problem CRUD authorization and validator shapes.
- Judge0 result mapping, compile/runtime errors, empty stdout, and polling failure/timeouts.
- Submission persistence atomicity between Submission and TestCaseResult.
- Playlist ownership and duplicate membership constraints.
- Frontend redirects, loading states, store error handling, and editor submission payloads.

When adding tests, keep route/controller tests independent of real secrets and external services by mocking Prisma, Judge0, SMTP, Cloudinary, and Axios.
