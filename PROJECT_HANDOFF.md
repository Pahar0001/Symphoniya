# PROJECT HANDOFF — «Симфония мебели»

> Документ для продолжения работы в новом чате Claude Code без доступа к истории переписки.
> Прочитай его целиком перед началом. Затем можешь работать сразу.

## 0. Как продолжить работу (для нового Claude Code)

- **Папка проекта (рабочая директория):** `/Users/marat/Новая папка/symphony-mebeli`
  - ⚠️ Держать проект **вне** `~/Desktop`, `~/Documents`, `~/Downloads` — macOS TCC блокирует к ним доступ, и git/сборка падают с `Operation not permitted`. Текущий путь (в `Новая папка`) — рабочий.
  - ⚠️ Путь содержит кириллицу и пробел. В bash оборачивай в кавычки: `cd "/Users/marat/Новая папка/symphony-mebeli"`. Для `mkdir` с шаблонами `[slug]`/`[id]` включай `set -o noglob`.
- **GitHub:** https://github.com/Pahar0001/Symphoniya (ветка `main`). `gh` CLI авторизован как `Pahar0001` (scopes repo, workflow).
- **Деплой:** Render (web, тариф Free, Docker) + Neon (внешний бесплатный Postgres). Пушим в `main` → Render авто-деплоит. Миграции и seed выполняет `docker/entrypoint.sh` при старте контейнера.
- **Проверки перед пушем:** `npm run typecheck && npm run lint && npm run build` (build запускать с фиктивным `DATABASE_URL`, он к БД не подключается).
- **Живая проверка против Neon:** запусти `npx next start -p 3100` с реальным `DATABASE_URL` (см. раздел «Переменные»), проверяй `curl` (preview-порт 3000 занят другим проектом, MCP-preview не работает; браузер-расширение claude-in-chrome тоже не подключено — визуальную проверку делай через curl-grep разметки).
- Секреты **не коммитить**: `.env` в `.gitignore`. На Render — через Dashboard → Environment.

## 1. О проекте

Сайт мебельной компании **«Симфония мебели»** (ребрендинг THE WOOD), Москва. Кухни и корпусная мебель на заказ. Многостраничный сайт: каталог из БД, портфолио, отзывы, калькулятор стоимости, ИИ-консультант, приём оплаты (ЮKassa, заготовлено), админ-панель с ролями, аккаунты клиентов.

**Дизайн-концепция:** «resonant stark + organic luxury» — спокойная статусная эстетика, приглушённая тёплая палитра (дерево / графит / тёплый белый / песочный), латунный акцент, много воздуха. Приём «симфония»: разделы главной = Movements (I–IV), тактовые хайрлайны, контраст «serif-заголовки vs моноширинные данные». Тёмная/светлая тема, плавные scroll-анимации, кастомный курсор, bento-сетки.

## 2. Стек технологий

| Слой | Технология |
|---|---|
| Framework | Next.js 14.2 (App Router, TypeScript strict) |
| Стили | Tailwind CSS 3.4, тема через CSS-переменные (`darkMode: "class"`) |
| Шрифты | Playfair Display (display) + Manrope (body) + IBM Plex Mono (mono), все с кириллицей, через `next/font/google` |
| БД | PostgreSQL (Neon), ORM **Prisma 5.22** |
| Авторизация | NextAuth 4 (Credentials, JWT-сессии), роли в токене |
| ИИ-консультант | Мультипровайдер: **Groq** (активен), Gemini, Anthropic — OpenAI-совместимый fetch / Anthropic SDK |
| Корзина | zustand + localStorage |
| Валидация | zod |
| Оплата | ЮKassa REST (обёртка готова, ключи не заданы — работает dev-режим) |
| Контейнер | Docker (multi-stage, standalone) + `entrypoint.sh` (migrate+seed+start) |
| Хостинг | Render (Docker, Free) + Neon (Postgres) |
| Хеши паролей | bcryptjs |

Алиас импортов: `@/*` → `src/*`.

## 3. Архитектура

- **App Router**, компоненты по умолчанию серверные; `"use client"` — только для состояния/эффектов/браузерных API.
- **Тема:** `src/app/globals.css` определяет семантические CSS-переменные для светлой (`:root`) и тёмной (`.dark`) темы: `--paper, --surface, --surface-2, --ink, --muted, --line, --walnut, --brass, --brass-soft`. `tailwind.config.ts` мапит их в классы `bg-paper`, `text-ink`, `border-line` и т.д. **Легаси-палитра** `cream-*/graphite-*/wood-*` оставлена как алиасы на те же переменные (в globals + tailwind) — старые страницы автоматически поддерживают обе темы. Анти-FOUC скрипт в `src/app/layout.tsx`.
- **Публичная «обвязка»** (Header/Footer/чат-виджет/курсор) рендерится в `SiteChrome`, которая скрывает её на `/admin`.
- **Доступ по ролям (RBAC):** `src/lib/roles.ts` — иерархия `OWNER(40) > ADMIN(30) > MANAGER(20) > CLIENT(10)` и хелперы `canAccessAdmin/canManageCatalog/canManageUsers/assignableRoles`. Защита страниц — в `AdminShell` (server, `getServerSession`), защита API — в каждом роуте.
- **ИИ:** `src/lib/ai.ts` (выбор провайдера по env, промпт), `src/lib/ai-context.ts` (подгружает каталог/цены/услуги/контакты из БД в системный промпт → ИИ отвечает по реальным данным сайта). Роут `src/app/api/ai-chat/route.ts`.
- **Единый источник правды по данным** — БД, всё управляется из `/admin` без ручного доступа к БД.

## 4. Структура БД (Prisma, `prisma/schema.prisma`)

Провайдер: `postgresql`, `url = env("DATABASE_URL")`.

- **Category**: `id, slug(unique), title, order, parentId?(self-relation дерево), products[]`. Слаги: `kuhni`, `korpusnaya-mebel`.
- **Product**: `id, slug(unique), title, description, price?, priceFrom(bool), style?, material?, categoryId→Category, images[], isPromo, isPublished, createdAt, updatedAt`.
- **ProductImage**: `id, url, alt?, order, productId→Product(onDelete Cascade)`.
- **Lead**: `id, name, phone, message?, source?(callback_form|ai_chat|checkout), createdAt`.
- **Order**: `id, customerName, phone, email?, items[], totalAmount, kind(deposit|full|ai_service|virtualization), status(pending|paid|failed|cancelled), yookassaPaymentId?, createdAt, updatedAt`.
- **OrderItem**: `id, orderId→Order(Cascade), productId?, title, qty, price`.
- **AdminUser** (аккаунты — и админы, и клиенты): `id, email(unique), passwordHash, name?, role(default "ADMIN"), phone?, createdAt`.
- **Service** (платные цифровые услуги): `id, slug(unique), title, description, price, kind(ai_service|virtualization), isActive`.
- **GenerationJob** (задел под видео/ИИ-генерацию): `id, leadId?, orderId?, provider(runway|higgsfield), status(queued|processing|done|failed), inputUrl?, resultUrl?, prompt?, createdAt, updatedAt`.
- **PortfolioItem**: `id, title, description?, image, category(kuhni|korpusnaya-mebel), city?, year?, material?, order, isPublished, createdAt`.
- **Review**: `id, author, city?, rating(1..5), text, source(site|yandex), isPublished(default true; форма с сайта создаёт false — на модерацию), createdAt`.

## 5. Миграции (`prisma/migrations/`)

1. `20260707000000_init` — базовая схема (Category, Product, ProductImage, Lead, Order, OrderItem, AdminUser, Service, GenerationJob).
2. `20260707100000_user_roles` — `AdminUser.role`, `AdminUser.phone`.
3. `20260707120000_portfolio_reviews` — таблицы `PortfolioItem`, `Review`.

Все применены к Neon. Новые миграции: правишь `schema.prisma` → генерируешь SQL (`npx prisma migrate diff --from-empty ...` или руками ALTER) в новую папку `prisma/migrations/<timestamp>_<name>/migration.sql` → применяешь к Neon (`DATABASE_URL=... npx prisma migrate deploy`) → коммитишь. На Render применится через entrypoint автоматически.

## 6. Реализованные функции

**Публичная часть:**
- Главная (`/`) — герой, бегущая строка материалов, Movements I–IV: направления, избранное (акции из БД), «как мы работаем», **калькулятор стоимости**, форма заявки.
- Каталог: `/katalog` (обзор), `/katalog/kuhni`, `/katalog/korpusnaya-mebel` — **bento-сетка** с флагманской карточкой, фильтры (стиль/материал/сортировка через кастомный `Select`), карточки с моно-данными (артикул, материал, срок).
- Карточка товара `/katalog/{cat}/{slug}` — галерея с зумом, **анимации** (Reveal), редакционные характеристики, кнопки «Заявка / Рассчитать / В корзину».
- **Портфолио** `/portfolio` — bento-галерея работ из БД, hover-зум, метаданные.
- **Отзывы** `/otzyvy` — карточки со звёздами, средний балл, форма «оставить отзыв» (на модерацию), место под виджет Яндекс.Карт.
- **Калькулятор** `/raschet` + секция на главной — материал/планировка/площадь/столешница/фурнитура/подсветка/ниши, живой расчёт с разбивкой. Бесплатно. Кнопка **«ИИ-визуализация · 200 ₽»** → мини-форма → оплата → `/visualizaciya/[id]` (реализовано, см. задачу №2).
- **Материалы-статьи** `/fasady` (интро о стоимости владения, карточки, таблица сравнения, палитра) + `/fasady/[slug]` — маркетинговая статья по каждому фасаду (`src/lib/materials.ts`): «почему дороже = выгоднее».
- **Регистрация** `/register` — запрет иностранных бесплатных почт (`src/lib/email-policy.ts`, блок-лист + `BLOCKED_EMAIL_DOMAINS`), проверка в `registerSchema.superRefine`.
- **Политика конфиденциальности** `/privacy-policy` — полная редакция по 152-ФЗ (трансграничная передача, локализация, права субъекта, Роскомнадзор). Требует внесения реквизитов Оператора юристом.
- Статические: `/akcii`, `/o-nas`, `/kontakty` (OSM-карта), `/uslugi` (платные услуги + оплата).
- Корзина `/korzina`, оформление `/checkout` (+`/success`, `/fail`), задаток 30% / полная оплата.
- **Аккаунты:** регистрация `/register`, вход `/login` (по роли → `/admin` или `/account`), личный кабинет `/account`.
- **ИИ-консультант** — плавающий виджет (публичные страницы), отвечает по данным сайта, создаёт лиды.
- Тёмная/светлая тема (тумблер в шапке), кастомный курсор, `robots.txt`, `sitemap.xml`.

**Админ-панель (`/admin`, роли MANAGER+):**
- Дашборд (счётчики), Каталог (CRUD товаров), **Портфолио** (добавить/удалить), **Отзывы** (модерация: публикация/удаление), Заказы, Заявки, **Ассистент** (тот же ИИ в окне панели), **Пользователи** (ADMIN+: создание, смена роли, удаление; защита от удаления себя/последнего OWNER).

**API-роуты (`src/app/api/`):** `ai-chat`, `leads`, `catalog`, `reviews` (POST на модерацию), `auth/[...nextauth]`, `auth/register`, `admin/products[/id]`, `admin/users[/id]`, `admin/reviews/[id]`, `admin/portfolio[/id]`, `payments/yookassa/{create,webhook}`, `video/generate`.

## 7. Открытые задачи (по приоритету)

1. ~~**Бесплатная карта на `/kontakty`**~~ ✅ **ГОТОВО (2026-07-08).** Яндекс-виджет заменён на бесплатный **OpenStreetMap iframe-эмбед** (без ключей/регистрации, работает в РФ). Новый компонент `src/components/maps/LocationMap.tsx` (координаты Тимирязевская 2/3 — **55.8079, 37.5733**, уточнены через Nominatim), старый `YandexMap.tsx` удалён. Адрес в `/kontakty` обновлён. Опционально можно переопределить готовым Яндекс-src через `NEXT_PUBLIC_YANDEX_MAP_SRC`. Виджет отзывов Яндекса (`src/components/reviews/YandexReviews.tsx`) оставлен опциональным по `NEXT_PUBLIC_YANDEX_ORG_ID`.
2. ~~**Платная ИИ-визуализация в калькуляторе (200 ₽)**~~ ✅ **ГОТОВО (2026-07-08).** Флоу: кнопка в калькуляторе → мини-форма (имя/телефон) → `POST /api/visualization/create` (создаёт `Order` kind=`ai_service` 200 ₽ + `GenerationJob` с конфигом в `prompt`) → оплата ЮKassa (metadata.orderId, webhook уже отмечает paid; **дев-режим без ключей → сразу `?dev=1`**) → страница результата `/visualizaciya/[id]` раскрывает рендер после оплаты. Логика — `src/lib/visualization.ts` (`generateVisualization`, `buildPrompt`, `describeConfig`, `AI_IMAGE_PRICE`). **8 рендеров сгенерированы через Higgsfield MCP** (модель `z_image`), лежат в `public/visualizations/{kitchen,cabinet}-{ldsp,mdf,veneer,solid}.jpg`; подбор по типу×фасаду (провайдер `curated`). Живая генерация «под проект» — задел `VISUALIZATION_PROVIDER=higgsfield` + `HIGGSFIELD_API_KEY` (Higgsfield MCP ≠ REST API прод-сайта, нужен реальный image-API). Миграций нет — переиспользованы `Order`/`GenerationJob`. **Не проверено сквозным кликом** — нет локального доступа к Neon (проверить на живом Render). Старый `api/video/generate`+`lib/video.ts` — отдельная задача №4 (виртуализация видео).
3. **[СЛЕДУЮЩАЯ] Живая ИИ-визуализация под точные параметры** — заказчик подтвердил: рендер должен строиться под конкретную конфигурацию клиента, а не подбираться из 8 курированных. Нужен серверный image-API (Higgsfield REST или аналог, т.к. MCP доступен только в сессии Claude, не прод-сайту). Реализовать ветку `VISUALIZATION_PROVIDER=higgsfield` в `src/lib/visualization.ts::generateVisualization` (сейчас TODO): вызов API с `buildPrompt(config)` → `resultUrl`, статус-поллинг в `GenerationJob`. Генерация после оплаты (в create-роуте или на странице результата). Нужен ключ провайдера + учёт времени генерации (async, показать «рендерим…»).
4. **Реальная ЮKassa** — задать `YOOKASSA_SHOP_ID`/`YOOKASSA_SECRET_KEY` (sandbox), протестировать оплату до статуса `paid`, настроить webhook `https://<домен>/api/payments/yookassa/webhook` в кабинете ЮKassa.
4. **Виртуализация квартиры по планировке** (Runway/аналог) — подключить провайдера к `src/lib/video.ts` (флаг `VIDEO_PROVIDER`).
5. **Figma-макет** — заказчик просил дизайн через Figma MCP; синхронизировать `design/tokens.json` и `tailwind.config.ts` с реальными токенами.
6. **Render `ADMIN_EMAIL`** — убедиться, что в Render env `ADMIN_EMAIL = marat.saidov.17@mail.ru` (иначе при рестарте entrypoint-seed создаст второго админа со старым email).
7. **Ротация секретов** — пользователь выкладывал в чат полные значения `GROQ_API_KEY`, `DATABASE_URL` (Neon). Рекомендовать перевыпуск: Groq (console.groq.com), Neon Reset password → обновить в Render.
8. **Uptime** — free Render засыпает через 15 мин. Обсуждали UptimeRobot (пинг `https://<домен>/robots.txt` каждые 5 мин). Альтернатива боли — платный Render Starter (~$7/мес, всегда включён).
9. Контент/фото заказчика (сейчас фото — Unsplash-URL), реквизиты для политики конфиденциальности, реальные телефон/почта/адрес в Footer/Contacts.

## 8. Переменные окружения

Полный шаблон — в `.env.example`. Декларации для Render — в `render.yaml`.

| Переменная | Назначение | Где |
|---|---|---|
| `DATABASE_URL` | Neon Postgres, **прямое** подключение (host без `-pooler`), `?sslmode=require` | Render, локально |
| `NEXTAUTH_SECRET` | секрет NextAuth (`openssl rand -base64 32`; на Render `generateValue`) | Render, локально |
| `NEXTAUTH_URL` | публичный URL сервиса | Render, локально |
| `NEXT_PUBLIC_SITE_URL` | публичный URL (метаданные, redirect ЮKassa) | Render, локально |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | первичный OWNER (создаётся seed) | Render, локально |
| `AI_PROVIDER` | `groq` \| `gemini` \| `anthropic` (сейчас **groq**); пусто = автовыбор по ключу | Render |
| `AI_MODEL` | переопределение модели (иначе дефолт провайдера) | Render (опц.) |
| `GROQ_API_KEY` | ключ Groq (активен; модель по умолчанию `llama-3.3-70b-versatile`) | Render |
| `GEMINI_API_KEY` | ключ Google Gemini (free-квота даёт 429 — не использовать как основной) | Render (опц.) |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL` | Claude Haiku (`claude-haiku-4-5-20251001`) | Render (опц.) |
| `YOOKASSA_SHOP_ID` / `YOOKASSA_SECRET_KEY` | оплата (пусто → dev-режим) | Render (опц.) |
| `VIDEO_PROVIDER` / `RUNWAY_API_KEY` | видео/виртуализация (`none` сейчас) | Render (опц.) |
| `NEXT_PUBLIC_YANDEX_ORG_ID` / `NEXT_PUBLIC_YANDEX_MAP_SRC` | Опц.: виджет отзывов Яндекса / переопределение src карты (карта по умолчанию — бесплатный OSM, ключ не нужен) | Render (опц.) |

Локальная строка Neon для смоук-тестов (в новой сессии перепроверь — могла быть ротирована):
`postgresql://neondb_owner:npg_RuFhiyj2cLO5@ep-rough-cloud-atnnf6a0.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require`

## 9. Текущий статус

- ✅ **Живой на Render**, деплой рабочий. GitHub `main`, последний коммит `c6d246f`.
- ✅ typecheck / lint / build — зелёные. Docker-образ и entrypoint (migrate+seed) проверены.
- ✅ ИИ-консультант **работает** (Groq) и отвечает по данным каталога.
- ✅ Neon наполнена: 2 категории, 4 товара, 2 услуги, 1 OWNER (`marat.saidov.17@mail.ru`), 6 работ портфолио, 4 отзыва.
- Вход в админку: `marat.saidov.17@mail.ru` + пароль из Render `ADMIN_PASSWORD` (роль OWNER).
- ✅ Карта на контактах работает — бесплатный OpenStreetMap-эмбед (Тимирязевская 2/3), без ключей.

## 10. Рекомендации по дальнейшей разработке

- **Стиль кода:** серверные компоненты по умолчанию; семантические токены (`bg-surface`, `text-ink`, `border-line`, `text-muted`, `text-brass`) — не хардкодить цвета; заголовки `font-display`, данные `font-mono`; анимации через `<Reveal>` (`src/components/ui/Reveal.tsx`); выпадающие списки — `<Select>` (`src/components/ui/Select.tsx`), не нативные.
- **Изображения** — плейсхолдеры на Unsplash-URL (`images.unsplash.com/photo-...`), рендерятся обычным `<img>` (не next/image). Реальные фото заказчик добавит через админку.
- **Новые модели** — миграцию применять и к Neon, и коммитить (entrypoint накатит на Render).
- **Секьюрити:** валидация zod во всех POST; API под ролями через `getServerSession` + хелперы `roles.ts`; секреты только в env.
- **Осторожно с полным пересозданием страниц** — часть файлов правил пользователь/линтер (напр. `not-found.tsx`, некоторые страницы ещё используют легаси-палитру `graphite-*/cream-*` — это ок, они тематические через алиасы).
- **Не пушить/не деплоить без явного запроса**; коммитить с `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- **CLAUDE.md проекта** (`.claude/CLAUDE.md`) — краткие конвенции, тоже прочитать.

## 11. Ключевые файлы (ориентир)

- Тема/стили: `src/app/globals.css`, `tailwind.config.ts`, `src/app/layout.tsx`.
- Обвязка: `src/components/layout/{Header,Footer,MobileNav,SiteChrome,ThemeToggle,CustomCursor}.tsx`.
- UI-кит: `src/components/ui/{Button,Container,Input,Modal,Select,Reveal}.tsx`.
- Каталог: `src/components/catalog/*`, `src/lib/catalog.ts`.
- Калькулятор: `src/lib/pricing.ts`, `src/components/calculator/Calculator.tsx`, `src/app/raschet/page.tsx`.
- Портфолио: `src/components/portfolio/PortfolioGallery.tsx`, `src/app/portfolio/page.tsx`, `src/components/admin/AdminPortfolio.tsx`.
- Отзывы: `src/components/reviews/*`, `src/app/otzyvy/page.tsx`, `src/components/admin/AdminReviews.tsx`.
- Карта (OpenStreetMap): `src/components/maps/LocationMap.tsx`, `src/app/kontakty/page.tsx`.
- ИИ: `src/lib/ai.ts`, `src/lib/ai-context.ts`, `src/app/api/ai-chat/route.ts`, `src/components/chat/{ChatPanel,AIChatWidget}.tsx`.
- Авторизация/роли: `src/lib/auth.ts`, `src/lib/roles.ts`, `src/types/next-auth.d.ts`, `src/components/admin/AdminShell.tsx`.
- Оплата: `src/lib/yookassa.ts`, `src/app/api/payments/yookassa/*`.
- Инфра: `docker/Dockerfile`, `docker/entrypoint.sh`, `docker-compose.yml`, `render.yaml`, `prisma/seed.mjs`.

---
*Проект: «Симфония мебели». Путь: `/Users/marat/Новая папка/symphony-mebeli`. Репозиторий: github.com/Pahar0001/Symphoniya (main). Хендофф актуален на коммит `c6d246f`.*
