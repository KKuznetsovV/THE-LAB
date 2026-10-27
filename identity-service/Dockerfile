FROM node:24-alpine AS build

WORKDIR /app
COPY lib /app/lib
WORKDIR /app/lib
RUN npm ci && npm run build && rm -rf node_modules

WORKDIR /app/identity-service
COPY identity-service/package.json identity-service/package-lock.json ./
RUN npm ci
COPY identity-service/ ./
RUN npm run build && npm ci --omit=dev

FROM node:24-alpine

ENV NODE_ENV=compose
WORKDIR /app/identity-service
COPY --from=build --chown=node:node /app/lib /app/lib
COPY --from=build --chown=node:node /app/identity-service/package.json ./
COPY --from=build --chown=node:node /app/identity-service/node_modules ./node_modules
COPY --from=build --chown=node:node /app/identity-service/dist ./dist
COPY --from=build --chown=node:node /app/identity-service/config ./config
USER node
EXPOSE 3110
CMD ["npm", "run", "compose"]
