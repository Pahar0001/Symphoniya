#!/bin/sh
# Entrypoint продакшн-контейнера: применяет миграции и seed, затем запускает сервер.
# Работает на любом хостинге (в т.ч. Render Free, где нет preDeployCommand).
# Прямой вызов node (без npx/tsx), чтобы резолвились wasm-движки Prisma в минимальном образе.
set -e

echo "[entrypoint] prisma migrate deploy…"
node node_modules/prisma/build/index.js migrate deploy

echo "[entrypoint] seed (идемпотентно)…"
node prisma/seed.mjs || echo "[entrypoint] seed пропущен/не критичен"

echo "[entrypoint] запуск Next.js…"
exec node server.js
