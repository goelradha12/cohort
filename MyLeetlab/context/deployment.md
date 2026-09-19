# Deployment

## Repository evidence
No Dockerfile, docker-compose file, CI workflow, hosting manifest, reverse-proxy configuration, or deployment script was found. The repository therefore does not define a verified deployment procedure.

## Runtime requirements inferred from code
- Node.js runtime for both packages.
- PostgreSQL database reachable by Prisma.
- Judge0-compatible execution service and token.
- SMTP provider for verification/password emails.
- Cloudinary credentials for profile image uploads.
- A frontend origin allowed by backend CORS.
- A production arrangement that serves frontend requests to `/api/v1` or changes the frontend API configuration.

## Needs verification before production
Cookie `secure`/`sameSite` settings, HTTPS termination, CORS origin policy, database migration process, Judge0 polling limits, secret management, logging, rate limiting, and frontend/backend hosting topology are not documented by the repository.
