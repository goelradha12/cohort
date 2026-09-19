# Development Workflow

## Install
Run package installation separately in `backend/` and `frontend/` using the committed lockfiles.

## Run locally
- Backend: `npm start` from `backend/`; this runs `nodemon src/index.js` and expects PostgreSQL, mail, and Judge0 variables.
- Frontend: `npm run dev` from `frontend/`; Vite serves the React application and the Axios client targets `http://localhost:3000/api/v1` in development.

## Frontend checks
- `npm run build`: Vite production build.
- `npm run lint`: ESLint over the frontend source.
- `npm run preview`: preview a built frontend.

## Backend checks
The backend package has no test, build, or lint script. Prettier configuration is in `backend/.prettierc`; format deliberately and avoid changing generated Prisma output.

## Database
The schema and migrations are under `backend/prisma`. Use the project's installed Prisma CLI and the correct database URLs for migration/generation work. No repository script documents deployment migrations, so confirm the environment and backup policy first.

## Change workflow
Inspect the owning route/controller/store/page and its validator before editing. Make the smallest compatible change, run the narrowest available lint/build check, then check API and schema assumptions.
