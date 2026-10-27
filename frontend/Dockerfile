FROM node:24-alpine AS builder

WORKDIR /app
COPY lib/package.json lib/package-lock.json /app/lib/
COPY lib/dist /app/lib/dist
COPY scripts/prerender.mjs scripts/sitemap.mjs scripts/public-routes.mjs /app/scripts/

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./

RUN npm ci

COPY frontend/ ./

# Alpine has no Chrome. Prerender runs in build:production on a machine that has it.
ARG SKIP_PRERENDER=1
ENV SKIP_PRERENDER=$SKIP_PRERENDER
ARG BUILD_SCRIPT=build:docker
RUN npm run ${BUILD_SCRIPT}

FROM nginx:alpine

COPY --from=builder /app/frontend/dist/ /usr/share/nginx/html/
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
