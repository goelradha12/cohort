# Backend (Express + Prisma) container.
# Behavior is unchanged from local dev; we simply run the same entry point with
# plain `node` instead of nodemon (nodemon only adds dev-time file watching).
FROM node:20-slim AS base

# openssl is required by Prisma's query engine at runtime.
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first for better layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the Prisma schema and generate the client into src/generated/prisma
# (the generator output path defined in schema.prisma).
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the source.
COPY . .

# The app reads PORT from the environment (defaults to 3000 in index.js).
ENV NODE_ENV=production
EXPOSE 3000

# Run the same entry point the start script uses, without nodemon.
CMD ["node", "src/index.js"]
