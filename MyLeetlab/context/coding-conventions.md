# Coding Conventions

## Verified patterns
- Backend uses ES module imports and `.js` extensions.
- React uses function components, hooks, JSX, and route-level files under `frontend/src/page`.
- Zustand actions own most frontend API calls and toast notifications.
- Backend routes compose middleware left-to-right: auth, verification/admin, validator, then controller.
- Prisma access is centralized through the `db` client.
- Successful backend responses commonly use `apiResponse`; validation uses `apiError`.
- Frontend styling is primarily Tailwind/DaisyUI utility classes.
- ESLint is configured for modern JS/JSX, React hooks, refresh rules, and unused variables.
- Backend Prettier uses two spaces, semicolons, double quotes, trailing commas, and no tabs.

## Contribution guidance
Preserve existing public route paths and JSON field names. Keep validation aligned across frontend Zod and backend express-validator. Use optional chaining in error display paths where existing stores do so. Do not hand-edit generated Prisma files or expose environment values in logs/docs. Match the owning file's existing formatting when making a focused change.
