# ─── multi-stage build для Next.js (standalone) ──────────────────
# Контекст сборки — корень репозитория (см. docker-compose.yml / render.yaml).

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ─── deps: установка зависимостей ────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# ─── build: сборка приложения ────────────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ─── runner: минимальный образ для продакшена ────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Непривилегированный пользователь.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
# Prisma нужна в рантайме: клиент + CLI и движки для миграций.
# Миграции/seed запускаются как `node node_modules/prisma/build/index.js migrate deploy`
# и `node prisma/seed.mjs` (см. render.yaml / docker-compose.yml) — без npx и tsx,
# чтобы корректно резолвились wasm-движки в node_modules/prisma/build.
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/node_modules/prisma ./node_modules/prisma
COPY --from=build /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=build /app/prisma ./prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
