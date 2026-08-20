import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { getProduct } from "@/lib/catalog";
import { formatPrice, articleFor } from "@/lib/format";

export async function ProductDetail({
  categorySlug,
  productSlug,
}: {
  categorySlug: string;
  productSlug: string;
}) {
  const product = await getProduct(categorySlug, productSlug);
  if (!product) notFound();

  const specs = [
    ["Артикул", articleFor(product.id)],
    product.style ? ["Стиль", product.style] : null,
    product.material ? ["Материал", product.material] : null,
    ["Срок", "4–8 недель"],
    ["Гарантия", "24 месяца"],
  ].filter(Boolean) as [string, string][];

  return (
    <section className="section">
      <Container>
        <Reveal>
          <nav className="mb-8 font-mono text-xs uppercase tracking-wider text-muted">
            <Link href="/katalog" className="hover:text-brass">Каталог</Link>
            {" · "}
            <Link href={`/katalog/${categorySlug}`} className="hover:text-brass">
              {product.category.title}
            </Link>
          </nav>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <ProductGallery images={product.images} title={product.title} />
          </Reveal>

          <Reveal delay={140}>
            <div>
              <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">{product.title}</h1>

              <p className="mt-5 text-3xl text-brass">{formatPrice(product.price, product.priceFrom)}</p>

              <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

              {/* Технические данные — моноширинный редакционный ряд */}
              <dl className="mt-8 divide-y divide-line border-y border-line">
                {specs.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-3">
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{k}</dt>
                    <dd className="text-ink">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="/kontakty" withArrow>Оставить заявку</ButtonLink>
                <ButtonLink href="/portfolio" variant="outline">Смотреть работы</ButtonLink>
              </div>

              <p className="mt-6 text-sm text-muted">
                Точную стоимость рассчитываем индивидуально по вашим размерам.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
