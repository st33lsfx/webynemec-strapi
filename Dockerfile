# Build stage - běží v GitHub Actions (7GB RAM)
FROM node:20-alpine AS builder

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev

WORKDIR /app

COPY . .

# Podpora monorepo: pokud existuje webynemec-strapi, zkopírovat obsah do /app
RUN if [ -d webynemec-strapi ] && [ -f webynemec-strapi/package.json ]; then \
      cp -r webynemec-strapi/. . && rm -rf webynemec-strapi webynemec; \
    fi

RUN npm ci

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
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 1337

CMD ["npm", "run", "start"]
