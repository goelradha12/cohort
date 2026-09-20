# Backend

## Bootstrap
`backend/src/index.js` loads environment values, configures CORS for `BASE_URL` and `http://localhost:5173`, parses cookies/urlencoded/JSON bodies, mounts `/api/v1/auth`, `/problems`, `/execute-code`, `/submission`, `/playlist`, `/leaderboard`, and `/companies` routers, and registers the global `errorHandler` last.

## Controller modules
- `auth.controllers.js`: registration, login, profile, logout, token refresh, verification, password recovery/change, profile update.
- `problem.controllers.js`: problem CRUD and solved lookup.
- `executeCode.controllers.js`: Judge0 run and submit flows.
- `submission.controllers.js`: user submissions and problem aggregates.
- `playlist.controllers.js`: playlist CRUD and problem membership.

## Middleware
`isLoggedIn` verifies the `accessToken` cookie and assigns `req.user` from the JWT. `isVerified` checks the current database user. `checkAdmin` checks verification and `role === ADMIN`. `validate` converts express-validator failures to a 422 `apiError`. Multer uses a 1 MB memory upload limit; Cloudinary handles image persistence. Rate limiting (`rateLimit.middleware.js`): `authRateLimiter` (10 per 15 min per IP) on sensitive auth routes; `executionRateLimiter` (3/min per user) on both execute-code routes.

## Error/response conventions
Successful controllers commonly return `apiResponse` with `{ statusCode, data, message, success: true }`. Most controllers also catch their own errors and respond directly. As a backstop, a global Express error handler (`middlewares/error.middleware.js`, registered last in `index.js`) renders any error forwarded via `asyncHandler`'s `next(err)` as JSON in the `apiError` shape, so errors no longer fall through to Express's default HTML handler.

## Database client
`src/libs/db.js` creates PrismaClient and installs a `$use` middleware that hashes User passwords on create/update when a password is present. The generated client under `src/generated/prisma` is derived output.
