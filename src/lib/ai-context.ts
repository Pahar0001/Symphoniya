import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

// Собирает актуальные данные сайта для системного промпта ИИ-консультанта,
// чтобы он отвечал по реальному каталогу, ценам и услугам.
export async function buildSiteContext(): Promise<string> {
  const [categories, products, services] = await Promise.all([
    prisma.category.findMany({ where: { parentId: null }, orderBy: { order: "asc" } }),
    prisma.product.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 60,
    }),
    prisma.service.findMany({ where: { isActive: true }, orderBy: { price: "asc" } }),
  ]);

  const cats = categories.map((c) => `- ${c.title} (/katalog/${c.slug})`).join("\n") || "—";

  const items =
    products
      .map((p) => {
        const parts = [
          `• ${p.title}`,
          `категория: ${p.category.title}`,
          p.style ? `стиль: ${p.style}` : "",
          p.material ? `материал: ${p.material}` : "",
          `цена: ${formatPrice(p.price, p.priceFrom)}`,
          p.isPromo ? "акция" : "",
        ].filter(Boolean);
        return parts.join(" · ");
      })
      .join("\n") || "Каталог пока пуст.";

  const srv =
    services
      .map((s) => `• ${s.title} — ${formatPrice(s.price, false)}: ${s.description}`)
      .join("\n") || "—";

  return `
КОМПАНИЯ: «Симфония мебели» (ранее THE WOOD), Москва. Кухни и корпусная мебель на заказ.
Срок изготовления: 4–8 недель. Гарантия: 24 месяца.
Контакты: телефон +7 (000) 000-00-00, почта info@symphony-mebeli.ru, страница /kontakty.

РАЗДЕЛЫ КАТАЛОГА:
${cats}

ТОВАРЫ В КАТАЛОГЕ (${products.length}):
${items}

ЦИФРОВЫЕ УСЛУГИ:
${srv}

Правила по ценам: называй ориентир как «от … ₽» и добавляй, что точная стоимость рассчитывается
индивидуально по проекту. Если товара нет в списке — не выдумывай, предложи оставить контакт.
`.trim();
}
