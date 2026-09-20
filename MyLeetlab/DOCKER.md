# Running MyLeetlab with Docker

The app is containerized as two services with **no application or architecture
changes**:

- **backend** — Express + Prisma, run with `node src/index.js` (same entry point
  as the `start` script, without the dev-only `nodemon` wrapper). Prisma's client
  is generated during the image build.
- **frontend** — the Vite production build served as static files by nginx, with
  an SPA fallback so client-side routes (`/problem/:id`, `/leaderboard`, …) work.

The database is **external** (managed PostgreSQL / Neon), so there is no database
container — the backend connects using `DATABASE_URL` / `DIRECT_URL` from its env.

## Prerequisites
- Docker + Docker Compose.
- `backend/.env` filled in (copy from `backend/.env.example`). Required names:
  `PORT`, `BASE_URL`, `NODE_ENV`, `DATABASE_URL`, `DIRECT_URL`,
  `ACCESS_TOKEN_SECRET`, `ACCESS_TOKEN_EXPIRY`, `REFRESH_TOKEN_SECRET`,
  `REFRESH_TOKEN_EXPIRY`, `JUDGE0_URL`, `SULU_API_TOKEN`, `RESEND_API_KEY`,
  `MAIL_FROM`, `CLOUDINARY_*`.

## Quick start
```bash
# from the repo root
docker compose up --build
```
- Frontend: http://localhost:5173
- Backend:  http://localhost:3000

The frontend is published on port 5173, which the backend's CORS config already
allows (`http://localhost:5173`), so no CORS changes are needed for local use.

## Configuring the frontend API URL
`VITE_API_URL` is baked into the frontend bundle at **build time** (Vite inlines
`import.meta.env.*`). The compose default is the production backend
`https://api.leetcode.radhagoyal.in/api/v1`. For a **local** build, override it:
```bash
VITE_API_URL=http://localhost:3000/api/v1 docker compose up --build
```
Changing it requires a rebuild of the frontend image (`--build`).

## Split-domain production deployment
Frontend `https://leetcode.radhagoyal.in`, backend `https://api.leetcode.radhagoyal.in`
are different origins, so this is a **cross-site, HTTPS** setup. Three things must align:

1. **Frontend build** — `VITE_API_URL=https://api.leetcode.radhagoyal.in/api/v1`
   (already the compose default).
2. **Backend CORS** — set `BASE_URL=https://leetcode.radhagoyal.in` in `backend/.env`.
   CORS allows `BASE_URL` (+ localhost for dev) with credentials.
3. **Cross-site cookies** — set `NODE_ENV=production` in `backend/.env`. The auth
   cookies are then issued `SameSite=None; Secure; HttpOnly`, which browsers require
   to send cookies across subdomains over HTTPS. (In development they fall back to
   `SameSite=Lax` without `Secure` so localhost http works.) `NODE_ENV=production`
   also enables `app.set('trust proxy', 1)` so secure cookies and the rate limiter's
   client-IP detection work behind a TLS-terminating reverse proxy.

Both domains must be served over **HTTPS** — `Secure` cookies are dropped on plain
HTTP. Terminate TLS at your proxy/load balancer in front of these containers.

## Running the images individually
```bash
# Backend
docker build -t myleetlab-backend ./backend
docker run --env-file ./backend/.env -p 3000:3000 myleetlab-backend

# Frontend (bake in the API URL)
docker build -t myleetlab-frontend --build-arg VITE_API_URL=http://localhost:3000/api/v1 ./frontend
docker run -p 5173:80 myleetlab-frontend
```

## Notes
- Secrets stay out of images: `.env` is excluded via `.dockerignore`; provide it
  at runtime with `env_file` (compose) or `--env-file` (docker run).
- The generated Prisma client (`backend/src/generated`) is rebuilt inside the
  image, not copied from the host.
- For a production deployment behind a single origin/reverse proxy, set
  `VITE_API_URL` accordingly (or use the same-origin `/api/v1` fallback) and set
  the backend `BASE_URL` to the public frontend origin for CORS.
