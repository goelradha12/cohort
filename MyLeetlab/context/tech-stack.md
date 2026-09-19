# Technology Stack

## Frontend
- JavaScript/JSX, React 19, React DOM.
- Vite 6 and `@vitejs/plugin-react`.
- React Router 7 (`react-router-dom`).
- Zustand 5 for client state.
- Axios for API calls.
- Tailwind CSS 4 with DaisyUI 5 via the Vite Tailwind plugin.
- Monaco editor via `@monaco-editor/react`.
- React Hook Form and Zod, with `@hookform/resolvers`, for forms.
- `lucide-react` icons and `react-hot-toast` notifications.

## Backend
- Node.js ES modules (`type: module`).
- Express 5.
- Prisma 6 with PostgreSQL.
- `jsonwebtoken` and `bcryptjs` for auth/token handling.
- `cookie-parser`, `cors`, `dotenv`, and `express-validator`.
- `express-rate-limit` for in-memory rate limiting on auth and execution routes.
- Judge0-compatible API through Axios.
- Nodemailer/Mailgen for email.
- Cloudinary, Multer, and Streamifier for image upload.
- Nodemon for the development server.

Exact dependency ranges are in `frontend/package.json` and `backend/package.json`; lockfiles are present for both packages.
