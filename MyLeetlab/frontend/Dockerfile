# Frontend (React + Vite) container.
# Multi-stage: build the static bundle, then serve it with nginx. Behavior is
# unchanged; VITE_API_URL is baked in at build time (consumed by src/lib/axios.js).

# ---- Build stage ----
FROM node:20-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# VITE_API_URL is a build-time variable (Vite inlines import.meta.env.* at build).
# Defaults to same-origin /api/v1 if not provided.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine AS serve

# SPA-aware nginx config (client-side routing fallback to index.html).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static build output.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
