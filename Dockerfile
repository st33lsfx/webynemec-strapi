# Build stage - běží v GitHub Actions (7GB RAM)
FROM node:20-alpine AS builder

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm run build

# Runtime stage - lehký, Railway jen spustí
FROM node:20-alpine AS runner

RUN apk add --no-cache vips-dev

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.strapi ./.strapi
COPY --from=builder /app/public ./public

EXPOSE 1337

CMD ["npm", "run", "start"]
