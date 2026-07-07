# Симфония мебели

Сайт мебельной компании «Симфония мебели» (ребрендинг THE WOOD): кухни и корпусная мебель на заказ.
Многостраничный сайт с каталогом из БД, админ-панелью, ИИ-консультантом, приёмом оплаты ЮKassa и
заделом под виртуализацию квартиры по планировке.

## Стек
Next.js 14 (App Router, TypeScript) · Tailwind CSS · Prisma + PostgreSQL · NextAuth (credentials) ·
Anthropic Claude API (Haiku) · ЮKassa REST API · Docker · Render.

## Возможности
- Каталог из БД: **Кухни** и **Корпусная мебель** с фильтрами (стиль, материал, сортировка).
- Карточки товаров, корзина, оформление заказа (задаток 30% / полная оплата).
- **ИИ-консультант** — плавающий чат на базе Claude, создаёт лиды.
- **ЮKassa**: предоплата/задаток за проект, оплата платных цифровых услуг (ИИ-консультация,
  виртуализация квартиры).
- **Админ-панель** `/admin`: дашборд, CRUD каталога, заказы, заявки — без прямого доступа к БД.
- SEO: SSR, `sitemap.xml`, `robots.txt`, `/admin` вне индексации.

---

## 1. Запуск локально (`npm run dev`)

Требуется Node 20+ и доступный PostgreSQL (можно поднять только БД из compose — см. ниже).

```bash
cp .env.example .env          # заполните значения (как минимум DATABASE_URL, NEXTAUTH_SECRET)
npm install
npm run prisma:deploy         # применить миграции (создаст таблицы)
npm run db:seed               # тестовые товары, услуги и админ-пользователь
npm run dev                   # http://localhost:3000
```

Быстрый Postgres для локальной разработки:
```bash
docker compose up -d postgres
# DATABASE_URL="postgresql://symphony:symphony@localhost:5432/symphony?schema=public"
```

Вход в админку: `http://localhost:3000/admin/login` — email/пароль из `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

> Без `ANTHROPIC_API_KEY` чат отвечает заглушкой. Без ключей ЮKassa оплата работает в дев-режиме
> (сразу редиректит на страницу успеха, заказ создаётся со статусом `pending`).

---

## 2. Запуск через Docker (`docker compose up`)

Поднимает `postgres` + one-shot `migrate` (миграции + seed) + `app`:

```bash
docker compose up --build
# приложение: http://localhost:3000
```

Переменные можно переопределить через окружение или файл `.env` рядом с `docker-compose.yml`
(например `ANTHROPIC_API_KEY`, `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY`, `NEXTAUTH_SECRET`).

---

## 3. Деплой на Render

1. Запушьте репозиторий на GitHub/GitLab.
2. Render Dashboard → **Blueprints** → **New Blueprint Instance** → выберите репозиторий.
   Render прочитает `render.yaml` (Web Service на Docker + Managed Postgres).
3. Задайте секреты в Dashboard (переменные с `sync: false`):
   - `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL` — публичный URL сервиса (например
     `https://symphony-mebeli.onrender.com`);
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`;
   - `ANTHROPIC_API_KEY`;
   - `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY`;
   - `RUNWAY_API_KEY` (если включаете `VIDEO_PROVIDER`).
   `DATABASE_URL` и `NEXTAUTH_SECRET` подставляются автоматически.
4. Деплой применит миграции через `preDeployCommand` (`prisma migrate deploy`).
5. **Первый seed** (создание админа и стартовых данных) выполните один раз через Render Shell:
   ```bash
   npx tsx prisma/seed.ts
   ```
6. В личном кабинете ЮKassa укажите URL webhook:
   `https://<ваш-домен>/api/payments/yookassa/webhook`.

---

## Структура
```
src/app            маршруты (страницы + api)
src/components      UI и блоки (layout, catalog, chat, checkout, admin, ui)
src/lib            db, auth, ai, yookassa, video, cart, catalog, validators
prisma             schema.prisma, migrations, seed.ts
design             tokens.json, figma-refs.md
docker             Dockerfile, .dockerignore
```

## Проверки
```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run build       # next build
```

## Переменные окружения
См. `.env.example` — все переменные с описанием. Реальные значения **никогда не коммитятся**.
