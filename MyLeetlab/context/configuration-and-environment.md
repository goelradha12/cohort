# Configuration and Environment

`backend/.env` exists locally and is ignored by Git. Values are intentionally omitted here.

| Variable | Use |
|---|---|
| `PORT` | Express listen port, default 3000 |
| `BASE_URL` | Allowed frontend CORS origin |
| `NODE_ENV` | Runtime mode |
| `DATABASE_URL` | Prisma PostgreSQL connection URL |
| `DIRECT_URL` | Prisma direct database URL |
| `ACCESS_TOKEN_SECRET`, `ACCESS_TOKEN_EXPIRY` | Access JWT signing and lifetime |
| `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRY` | Refresh JWT signing and lifetime |
| `JUDGE0_URL` | Judge0-compatible service base URL |
| `SULU_API_TOKEN` | Judge0-compatible service auth token |
| `RESEND_API_KEY` | Resend API key for email delivery |
| `MAIL_FROM` | Sender identity for outgoing mail, e.g. `LeetLab <noreply@radhagoyal.in>` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_URL` | Image upload configuration; code directly uses the first three |

Frontend configuration is not loaded from a committed `.env` file. `axios.js` uses Vite's `import.meta.env.MODE`: development targets localhost backend, other modes use `/api/v1`.

## Environment templates
Sanitized templates now exist and are tracked in Git (placeholders only, no real values):
- `backend/.env.example` — all backend variables above plus a commented admin-seed section for remediation item 12b.
- `frontend/.env.example` — documents a future `VITE_API_URL` for remediation item 8. It is **not** read yet; `axios.js` must be updated before it takes effect.

Copy each to `.env` in the same folder and fill in real values. Both `.env` files are git-ignored (`backend/.gitignore` ignores `.env`; `frontend/.gitignore` ignores `.env`/`.env.*` while keeping `.env.example`).

Still not present: proxy/reverse-proxy configuration, hosting configuration, or a documented production variable policy. See [remediation-plan.md](remediation-plan.md) items 8 and 13.
