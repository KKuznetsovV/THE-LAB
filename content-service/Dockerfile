FROM node:24-alpine AS build

WORKDIR /app
COPY lib /app/lib
WORKDIR /app/lib
RUN npm ci && npm run build && rm -rf node_modules

WORKDIR /app/content-service
COPY content-service/package.json content-service/package-lock.json ./
RUN npm ci
COPY content-service/ ./
RUN npm run build && npm ci --omit=dev

FROM node:24-alpine

ENV NODE_ENV=compose
WORKDIR /app/content-service
COPY --from=build --chown=node:node /app/lib /app/lib
COPY --from=build --chown=node:node /app/content-service/package.json ./
COPY --from=build --chown=node:node /app/content-service/node_modules ./node_modules
COPY --from=build --chown=node:node /app/content-service/dist ./dist
COPY --from=build --chown=node:node /app/content-service/config ./config
COPY --chown=node:node db/seed.sql /app/db/seed.sql
USER node
EXPOSE 3109
CMD ["npm", "run", "compose"]
