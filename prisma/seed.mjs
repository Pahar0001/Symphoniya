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
  const email = process.env.ADMIN_EMAIL ?? "admin@symphony-mebeli.ru";
  const password = process.env.ADMIN_PASSWORD ?? "change-me";
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Администратор",
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
      image: "/images/catalog/kuhni/classic-oak.jpg",
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
      image: "/images/catalog/kuhni/hi-tech-graphite.jpg",
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
      image: "/images/catalog/korpusnaya-mebel/garderobnaya-modern.jpg",
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
      image: "/images/catalog/korpusnaya-mebel/stellazh-postmodern.jpg",
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
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
