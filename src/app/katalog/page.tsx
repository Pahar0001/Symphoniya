import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Каталог" };
export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <CategoryHero
        eyebrow="Каталог"
        title="Два направления, один почерк"
        description="Кухни и корпусная мебель на заказ. Единый стиль, натуральные материалы, индивидуальный расчёт."
      />
      <section className="section">
        <Container className="grid gap-6 sm:grid-cols-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/katalog/${c.slug}`}
              className="group flex flex-col justify-end rounded-lg border border-wood-100 bg-cream-100 p-10 transition hover:border-wood-300"
            >
              <h2 className="font-display text-3xl text-graphite-800">{c.title}</h2>
              <p className="mt-2 text-graphite-500">{c._count.products} позиций в каталоге</p>
              <span className="mt-6 text-sm text-wood-600 group-hover:underline">Смотреть →</span>
            </Link>
          ))}
        </Container>
      </section>
    </>
  );
}
