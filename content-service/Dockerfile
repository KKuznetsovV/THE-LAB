FROM node:24-alpine
WORKDIR /app
COPY lib/package.json lib/package-lock.json /app/lib/
COPY lib/dist /app/lib/dist
COPY db /app/db
WORKDIR /app/content-service
COPY content-service/package.json content-service/package-lock.json ./
RUN npm ci
COPY content-service/ ./
RUN npm run build
EXPOSE 3109
CMD ["npm", "run", "docker"]
