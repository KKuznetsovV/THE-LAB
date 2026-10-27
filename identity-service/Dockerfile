FROM node:24-alpine
WORKDIR /app
COPY lib/package.json lib/package-lock.json /app/lib/
COPY lib/dist /app/lib/dist
WORKDIR /app/identity-service
COPY identity-service/package.json identity-service/package-lock.json ./
RUN npm ci
COPY identity-service/ ./
RUN npm run build
EXPOSE 3110
CMD ["npm", "run", "docker"]
