import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { ProductCard } from "@/components/catalog/ProductCard";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Акции" };
export const dynamic = "force-dynamic";

export default async function AkciiPage() {
  const promo = await prisma.product.findMany({
    where: { isPromo: true, isPublished: true },
    include: { images: { orderBy: { order: "asc" } }, category: true },
  });

  return (
    <>
      <CategoryHero
        eyebrow="Специальные предложения"
        title="Акции"
        description="Актуальные предложения на кухни и корпусную мебель. Условия уточняйте у консультанта."
      />
      <section className="section">
        <Container>
          {promo.length === 0 ? (
            <p className="text-graphite-500">Сейчас активных акций нет. Загляните позже.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {promo.map((p) => (
                <ProductCard key={p.id} product={p} categorySlug={p.category.slug} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
