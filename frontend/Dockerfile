FROM node:24-bookworm-slim AS builder

WORKDIR /app
COPY lib /app/lib
WORKDIR /app/lib
RUN npm ci && npm run build && rm -rf node_modules

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
COPY scripts/prerender.mjs scripts/sitemap.mjs scripts/public-routes.mjs scripts/seed-fallback.mjs /app/scripts/
COPY db/seed.sql /app/db/seed.sql

# The image prerenders public routes. Seed SQL is the fallback when content-service is down.
ARG SKIP_PRERENDER=0
ENV SKIP_PRERENDER=$SKIP_PRERENDER
ARG BUILD_SCRIPT=build:docker
RUN if [ "$SKIP_PRERENDER" != "1" ]; then npx playwright install --with-deps chromium && export PLAYWRIGHT_USE_BUNDLED=1; fi \
  && npm run "$BUILD_SCRIPT"

FROM nginx:alpine

COPY --from=builder /app/frontend/dist/ /usr/share/nginx/html/
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY frontend/nginx-security-headers.conf /etc/nginx/security-headers.conf
COPY frontend/nginx-proxy.conf /etc/nginx/proxy.conf

CMD ["nginx", "-g", "daemon off;"]
