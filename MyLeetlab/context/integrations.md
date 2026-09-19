# Integrations

## Judge0-compatible execution
`backend/src/libs/judge0lib.js` maps C/CPP/Python/Java/JavaScript names to language IDs, posts a batch to `${JUDGE0_URL}/submissions/batch`, then polls the same endpoint until status IDs are not queued/running. `SULU_API_TOKEN` is sent as `X-Auth-Token`. The implementation uses exact trimmed stdout comparison against expected output.

## Email
`backend/src/utils/mail.js` uses Nodemailer with Mailtrap settings and Mailgen templates for email verification and forgot-password messages. Required variable names are listed in [configuration-and-environment.md](configuration-and-environment.md).

## Cloudinary
`cloudinary.middleware.js` configures Cloudinary from environment values. `updateProfile` receives an image through Multer memory storage and uploads/deletes media through Cloudinary helpers.

## Frontend integrations
Monaco renders the code editor. Axios sends cookies. DaisyUI/Tailwind provide styling and theme utilities. React Hot Toast communicates async success/failure. External portfolio links and avatar/image URLs are embedded in `PortfolioPage`/`Navbar`; they are not backend-managed assets.
