# Directory Structure

```text
backend/
  prisma/schema.prisma                 current PostgreSQL/Prisma contract
  prisma/migrations/                   committed schema history
  src/index.js                         Express entry point
  src/routes/                          API registration
  src/controllers/                     request/business handlers
  src/validators/                      express-validator rules
  src/middlewares/                     auth, upload, validation, integrations
  src/libs/db.js                       Prisma client and middleware
  src/libs/judge0lib.js                Judge0 adapter
  src/utils/                           errors, responses, tokens, email, seed helper
  src/generated/prisma/                generated Prisma client; do not hand-edit
frontend/
  src/main.jsx                         React entry point
  src/App.jsx                          route table and auth bootstrap
  src/page/                             route-level screens
  src/components/                       reusable UI and modals
  src/layout/                           shared layout
  src/store/                            Zustand stores
  src/lib/                              Axios and language helpers
  src/validators/                       Zod form schemas
  src/samples/                          sample problem data
  src/assets/                           bundled images/assets
context/                                AI-maintained project documentation
```

Ignored/generated content includes `node_modules`, `dist`, local `.env` values, and generated Prisma client output. `backend/src/public/images/.gitkeep` exists, but upload middleware uses memory storage and Cloudinary rather than writing persistent local files.
