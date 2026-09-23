# Deployment

## Repository evidence
The backend is deployed to **Azure App Service** via GitHub Actions (`.github/workflows/deploy-myleetlab-backend.yml`): it installs deps with `npm ci`, runs `prisma generate`, applies `prisma migrate deploy` against the production database, and publishes the `MyLeetlab/backend` package. The app can also be containerized: `backend/Dockerfile` (Node 20, `npm ci`, `prisma generate`, runs `node src/index.js`) and `frontend/Dockerfile` (multi-stage Vite build → nginx serving `dist/` with SPA fallback via `frontend/nginx.conf`); `DOCKER.md` documents local container usage. The database is external (managed PostgreSQL / Neon) — no DB container. `.dockerignore` files keep `node_modules`, `.env*`, and the generated Prisma client out of build contexts. See `DOCKER.md`.

Behavior is unchanged: the container runs the same backend entry point (without the dev-only `nodemon`) and serves the same production frontend bundle.

## Runtime requirements inferred from code
- Node.js runtime for both packages.
- PostgreSQL database reachable by Prisma.
- Judge0-compatible execution service and token.
- Resend API key (`RESEND_API_KEY`) and a verified `MAIL_FROM` for verification/password emails.
- Cloudinary credentials for profile image uploads.
- A frontend origin allowed by backend CORS.
- A production arrangement that serves frontend requests to `/api/v1` or changes the frontend API configuration.

## Split-domain configuration (implemented)
For frontend `leetcode.radhagoyal.in` + backend `api.leetcode.radhagoyal.in` (cross-site, HTTPS):
- Auth cookies are environment-aware via `getCookieOptions()` in `utils/generateTokens.js`: `NODE_ENV=production` → `SameSite=None; Secure; HttpOnly` (required cross-site); otherwise `SameSite=Lax`, not secure (local http). Used at login, refresh, and logout `clearCookie`.
- CORS in `index.js` allows `BASE_URL` (+ localhost), credentials enabled; falsy origins filtered.
- `app.set('trust proxy', 1)` when `NODE_ENV=production` (secure cookies + rate-limiter client IP behind a proxy).
- Frontend `VITE_API_URL` (build-time) points at the backend subdomain.
Required prod env: `NODE_ENV=production`, `BASE_URL=https://leetcode.radhagoyal.in`, frontend built with `VITE_API_URL=https://api.leetcode.radhagoyal.in/api/v1`. Both origins must be served over HTTPS. See `DOCKER.md`.

## Needs verification before production
HTTPS/TLS termination at the proxy, database migration process, Judge0 polling limits, and secret management are still not defined by the repository. Cookie/CORS/topology are configured above, while runtime logging is now reduced in the frontend and development-gated for Judge0/server startup messages. Validate all of this in the live environment.
