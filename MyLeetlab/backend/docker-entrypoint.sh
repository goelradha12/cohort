#!/bin/sh
# Container entrypoint: apply any pending Prisma migrations, then start the app.
#
# Migrations run here (from inside the deployed container on Azure) rather than
# in the GitHub Actions runner, because Azure App Service can reach the database
# while a GitHub-hosted runner often cannot (IP allowlists on managed Postgres
# such as Neon). This is what caused the earlier "migration" failure in CI.
set -e

echo "Applying database migrations (prisma migrate deploy)..."
npx prisma migrate deploy

echo "Starting backend..."
exec node src/index.js
