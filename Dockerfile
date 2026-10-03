FROM node:22-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
RUN npm ci
COPY . .
# Domaine des photos autorisé par next/image, figé au build.
ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=build --chown=node:node /app ./
USER node
EXPOSE 4000
CMD ["npm", "start"]
