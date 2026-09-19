# Authentication and Authorization

## Tokens and cookies
`generateTokens.js` signs access and refresh JWTs using `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`, with expiries from the corresponding environment variables. Access authentication reads the `accessToken` cookie. The decoded payload uses `_id` for the user ID.

## Guards
- `isLoggedIn`: verifies access JWT and sets `req.user`.
- `isVerified`: loads `req.user._id` and requires `User.isEmailVerified`.
- `checkAdmin`: loads the user, requires verified email, and requires `role === ADMIN`.
- Frontend `AdminRoute` improves UX by redirecting non-admin users, but backend guards are the security boundary.

## Passwords and reset
The Prisma middleware in `backend/src/libs/db.js` hashes User passwords with bcrypt on create/update. Temporary verification/reset tokens are generated in `generateTemporaryTokens.js`; email content is produced by Mailgen and sent through Nodemailer.

## Security cautions
- Never document or commit secret values from `backend/.env`.
- The checked-in `utils/createAdmin.js` contains a plaintext seed password in source and should be treated as a security risk; it is not a package script.
- `changePassword` is registered without `isLoggedIn` in `auth.routes.js`; verify and correct the controller contract before treating it as safe.
- Token cookie options and refresh behavior must be reviewed in `auth.controllers.js` before production changes.
