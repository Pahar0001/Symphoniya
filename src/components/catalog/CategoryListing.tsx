import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { Filters } from "@/components/catalog/Filters";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { getCategoryWithProducts, type CatalogQuery } from "@/lib/catalog";
import { notFound } from "next/navigation";

// Bento-раскладка: первая карточка — крупный флагман (2 колонки),
// далее чередование ширины для «редакционного» ритма.
function span(index: number): string {
  if (index === 0) return "sm:col-span-2 lg:col-span-2";
  // Каждый 5-й элемент после флагмана — снова широкий (создаёт неоднородность bento).
  if (index > 0 && (index - 1) % 5 === 4) return "lg:col-span-2";
  return "";
}

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
          <div className="mb-12">
            <Filters styles={styles} materials={materials} />
          </div>
          {products.length === 0 ? (
            <p className="text-muted">По выбранным фильтрам ничего не найдено.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i, 6) * 70} className={span(i)}>
                  <ProductCard product={p} categorySlug={slug} featured={i === 0} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
