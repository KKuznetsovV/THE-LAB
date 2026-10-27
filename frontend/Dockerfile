FROM node:24-alpine AS builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./

RUN npm ci

COPY frontend/ ./

ARG BUILD_SCRIPT=build:docker
RUN npm run ${BUILD_SCRIPT}

FROM nginx:alpine

COPY --from=builder /app/frontend/dist/ /usr/share/nginx/html/
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
