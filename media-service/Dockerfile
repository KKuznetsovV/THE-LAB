FROM node:24-alpine
WORKDIR /app
COPY lib/package.json lib/package-lock.json /app/lib/
COPY lib/dist /app/lib/dist
WORKDIR /app/media-service
COPY media-service/package.json media-service/package-lock.json ./
RUN npm ci
COPY media-service/ ./
RUN npm run build
EXPOSE 3106
CMD ["npm", "run", "docker"]
