import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Плейсхолдер-контент на этапе разработки. Реальные карточки и фото
// заказчик добавляет через /admin (CRUD) — БД остаётся источником правды.
// Чистый JS (ESM), чтобы seed запускался и в проде (`node prisma/seed.mjs`) без tsx.
async function main() {
  // ── Админ (всегда) ───────────────────────────────────────────
  // Гарантируем наличие админ-пользователя при каждом запуске (upsert не меняет
  // существующего). Так вход в /admin работает даже после первого деплоя.
  const email = process.env.ADMIN_EMAIL ?? "marat.saidov.17@mail.ru";
  const password = process.env.ADMIN_PASSWORD ?? "change-me";
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Владелец",
      role: "OWNER",
      passwordHash: await bcrypt.hash(password, 10),
    },
  });
  console.log("admin:", email);

  // Демо-каталог наполняем только при ПЕРВОМ запуске (пустая БД), чтобы не
  // «воскрешать» товары, удалённые администратором. Дальше каталог — из /admin.
  const existing = await prisma.category.count();
  if (existing > 0) {
    console.log("seed: каталог уже наполнен, пропускаю демо-данные");
    return;
  }

  // ── Категории ────────────────────────────────────────────────
  const kuhni = await prisma.category.upsert({
    where: { slug: "kuhni" },
    update: {},
    create: { slug: "kuhni", title: "Кухни", order: 1 },
  });

  const korpus = await prisma.category.upsert({
    where: { slug: "korpusnaya-mebel" },
    update: {},
    create: { slug: "korpusnaya-mebel", title: "Корпусная мебель", order: 2 },
  });

  // ── Товары ───────────────────────────────────────────────────
  const products = [
    {
      slug: "kuhnya-classic-oak",
      title: "Кухня «Классика», массив дуба",
      description:
        "Кухня в спокойной классической эстетике из массива дуба с ручной патиной. Изготовление под ваши размеры.",
      price: 320000,
      style: "классика",
      material: "массив дуба",
      categoryId: kuhni.id,
      image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1000&q=80&auto=format&fit=crop",
    },
    {
      slug: "kuhnya-hi-tech-graphite",
      title: "Кухня «Графит», хай-тек",
      description:
        "Минималистичная кухня без ручек, матовые фасады цвета графит, интегрированная техника.",
      price: 410000,
      style: "хай-тек",
      material: "МДФ, эмаль",
      categoryId: kuhni.id,
      image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1000&q=80&auto=format&fit=crop",
    },
    {
      slug: "shkaf-garderobnaya-modern",
      title: "Гардеробная система «Модерн»",
      description:
        "Корпусная гардеробная под потолок с системой хранения по индивидуальному проекту.",
      price: 180000,
      style: "модерн",
      material: "ЛДСП, шпон",
      categoryId: korpus.id,
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1000&q=80&auto=format&fit=crop",
    },
    {
      slug: "stellazh-postmodern",
      title: "Стеллаж-перегородка «Постмодерн»",
      description:
        "Открытый стеллаж-перегородка из шпона ореха, зонирует пространство и служит акцентом.",
      price: null, // цена по запросу
      style: "постмодерн",
      material: "шпон ореха",
      categoryId: korpus.id,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80&auto=format&fit=crop",
    },
  ];

  for (const p of products) {
    const { image, ...data } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...data,
        isPromo: p.slug === "kuhnya-hi-tech-graphite",
        images: { create: [{ url: image, order: 0, alt: p.title }] },
      },
    });
    console.log("product:", product.slug);
  }

  // ── Платные услуги ──────────────────────────────────────────
  await prisma.service.upsert({
    where: { slug: "ai-consultation" },
    update: {},
    create: {
      slug: "ai-consultation",
      title: "Расширенная консультация ИИ-дизайнера",
      description:
        "Персональный подбор конфигурации кухни/мебели с расчётом и рекомендациями от ИИ-агента.",
      price: 990,
      kind: "ai_service",
    },
  });

  await prisma.service.upsert({
    where: { slug: "apartment-virtualization" },
    update: {},
    create: {
      slug: "apartment-virtualization",
      title: "Виртуализация квартиры по планировке",
      description:
        "Загрузите планировку — сгенерируем видео-обход интерьера с вашей мебелью (Runway/видеогенерация).",
      price: 4900,
      kind: "virtualization",
    },
  });

  console.log("seed: демо-каталог создан");

  // ── Портфолио (только если пусто) ────────────────────────────
  if ((await prisma.portfolioItem.count()) === 0) {
    await prisma.portfolioItem.createMany({ data: PORTFOLIO });
    console.log("seed: портфолио создано");
  }

  // ── Отзывы (только если пусто) ───────────────────────────────
  if ((await prisma.review.count()) === 0) {
    await prisma.review.createMany({ data: REVIEWS });
    console.log("seed: отзывы созданы");
  }
}

const PORTFOLIO = [
  { title: "Кухня в квартире у парка", description: "Матовая эмаль цвета графит, кварцевая столешница, интегрированная техника.", image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1000&q=80&auto=format&fit=crop", category: "kuhni", city: "Москва", year: 2025, material: "МДФ, эмаль", order: 1 },
  { title: "Классическая кухня из дуба", description: "Массив дуба с ручной патиной, латунная фурнитура.", image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1000&q=80&auto=format&fit=crop", category: "kuhni", city: "Москва", year: 2024, material: "Массив дуба", order: 2 },
  { title: "Гардеробная под потолок", description: "Система хранения по индивидуальному проекту, шпон ореха.", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1000&q=80&auto=format&fit=crop", category: "korpusnaya-mebel", city: "Химки", year: 2025, material: "ЛДСП, шпон", order: 3 },
  { title: "Кухня-остров в загородном доме", description: "Островная планировка, натуральный камень, тёплое дерево.", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1000&q=80&auto=format&fit=crop", category: "kuhni", city: "МО", year: 2024, material: "Шпон, камень", order: 4 },
  { title: "Стеллаж-перегородка", description: "Открытый стеллаж из шпона ореха, зонирование гостиной.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80&auto=format&fit=crop", category: "korpusnaya-mebel", city: "Москва", year: 2025, material: "Шпон ореха", order: 5 },
  { title: "Минималистичная белая кухня", description: "Фасады без ручек, скрытая подсветка, мраморная столешница.", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&q=80&auto=format&fit=crop", category: "kuhni", city: "Москва", year: 2025, material: "МДФ, эмаль", order: 6 },
];

const REVIEWS = [
  { author: "Анна К.", city: "Москва", rating: 5, text: "Заказывали кухню из дуба — сделали точно в срок, качество превзошло ожидания. Отдельное спасибо за ИИ-консультанта, помог определиться со стилем.", source: "site" },
  { author: "Дмитрий В.", city: "Химки", rating: 5, text: "Гардеробная встала идеально, всё по миллиметру. Приятно, что цену рассчитали заранее, без сюрпризов.", source: "site" },
  { author: "Марина С.", city: "Москва", rating: 4, text: "Красивая кухня, спокойный дизайн — как и хотели. Небольшая задержка по фурнитуре, но менеджер держал в курсе.", source: "yandex" },
  { author: "Олег П.", city: "Московская обл.", rating: 5, text: "Остров с камнем — мечта. Монтаж аккуратный, за собой всё убрали. Рекомендую.", source: "yandex" },
];

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
