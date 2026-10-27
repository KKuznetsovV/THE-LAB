FROM node:24-alpine AS build

WORKDIR /app
COPY lib /app/lib
WORKDIR /app/lib
RUN npm ci && npm run build && rm -rf node_modules

WORKDIR /app/media-service
COPY media-service/package.json media-service/package-lock.json ./
RUN npm ci
COPY media-service/ ./
RUN npm run build && npm ci --omit=dev

FROM node:24-alpine

ENV NODE_ENV=compose
WORKDIR /app/media-service
COPY --from=build --chown=node:node /app/lib /app/lib
COPY --from=build --chown=node:node /app/media-service/package.json ./
COPY --from=build --chown=node:node /app/media-service/node_modules ./node_modules
COPY --from=build --chown=node:node /app/media-service/dist ./dist
COPY --from=build --chown=node:node /app/media-service/config ./config
USER node
EXPOSE 3106
CMD ["npm", "run", "compose"]
