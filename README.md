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

## 3. Деплой на Render (Free) + Neon (бесплатный Postgres)

База данных вынесена в Neon (у Render нет бесплатного Postgres). Приложение —
Web Service на Docker (тариф Free). Миграции и seed выполняет entrypoint контейнера
при старте, поэтому платный `preDeployCommand` не нужен.

1. **Создайте бесплатную БД на [neon.tech](https://neon.tech)** → New Project.
   Скопируйте строку подключения. Используйте **прямое** подключение — host **без**
   суффикса `-pooler` (вкладка Connection Details → Direct connection), с `?sslmode=require`.
   Пример: `postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`.
2. Запушьте репозиторий на GitHub.
3. Render Dashboard → **New → Blueprint** → выберите репозиторий. Render прочитает
   `render.yaml` (Web Service на Docker). Нажмите **Apply**.
4. Задайте переменные окружения (сервис `symphony-mebeli` → **Environment**):
   - `DATABASE_URL` — строка из Neon (см. п.1);
   - `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL` — публичный URL сервиса (например
     `https://symphony-mebeli.onrender.com`);
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` — данные для входа в админку;
   - `ANTHROPIC_API_KEY` — ключ Claude (без него чат отвечает заглушкой);
   - `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY` — для оплаты (можно sandbox);
   - `RUNWAY_API_KEY` — если включаете `VIDEO_PROVIDER`.
   `NEXTAUTH_SECRET` генерируется автоматически.
5. При старте контейнер сам применит миграции и seed: создаст таблицы, демо-каталог,
   услуги и админ-пользователя. Демо-товары добавляются только при первом запуске
   (пустая БД) — админ полностью управляет каталогом дальше.
6. В личном кабинете ЮKassa укажите URL webhook:
   `https://<ваш-домен>/api/payments/yookassa/webhook`.

> Тариф Free «засыпает» при простое (первый запрос ~30 сек). Для боевого приёма оплаты
> позже поднимите web-сервис до `starter`.

---

## Структура
```
src/app            маршруты (страницы + api)
src/components      UI и блоки (layout, catalog, chat, checkout, admin, ui)
src/lib            db, auth, ai, yookassa, video, cart, catalog, validators
prisma             schema.prisma, migrations, seed.mjs
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
