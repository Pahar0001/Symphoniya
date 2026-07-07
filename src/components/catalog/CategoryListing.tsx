import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { Filters } from "@/components/catalog/Filters";
import { ProductCard } from "@/components/catalog/ProductCard";
import { getCategoryWithProducts, type CatalogQuery } from "@/lib/catalog";
import { notFound } from "next/navigation";

// Переиспользуемый листинг категории (Кухни / Корпусная мебель).
export async function CategoryListing({
  slug,
  eyebrow,
  description,
  searchParams,
}: {
  slug: string;
  eyebrow?: string;
  description?: string;
  searchParams: CatalogQuery;
}) {
  const data = await getCategoryWithProducts(slug, searchParams);
  if (!data) notFound();
  const { category, products, styles, materials } = data;

  return (
    <>
      <CategoryHero eyebrow={eyebrow} title={category.title} description={description} />
      <section className="section">
        <Container>
          <div className="mb-10">
            <Filters styles={styles} materials={materials} />
          </div>
          {products.length === 0 ? (
            <p className="text-graphite-500">По выбранным фильтрам ничего не найдено.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} categorySlug={slug} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
