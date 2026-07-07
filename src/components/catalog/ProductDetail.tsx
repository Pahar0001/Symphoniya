import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { AddToCartButton } from "@/components/catalog/AddToCartButton";
import { ButtonLink } from "@/components/ui/Button";
import { getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export async function ProductDetail({
  categorySlug,
  productSlug,
}: {
  categorySlug: string;
  productSlug: string;
}) {
  const product = await getProduct(categorySlug, productSlug);
  if (!product) notFound();

  return (
    <section className="section">
      <Container>
        <nav className="mb-8 text-sm text-graphite-400">
          <Link href="/katalog" className="hover:text-wood-600">Каталог</Link>
          {" · "}
          <Link href={`/katalog/${categorySlug}`} className="hover:text-wood-600">
            {product.category.title}
          </Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} title={product.title} />

          <div>
            <h1 className="font-display text-4xl text-graphite-800">{product.title}</h1>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-graphite-500">
              {product.style && (
                <span className="rounded-full bg-cream-200 px-3 py-1">{product.style}</span>
              )}
              {product.material && (
                <span className="rounded-full bg-cream-200 px-3 py-1">{product.material}</span>
              )}
            </div>

            <p className="mt-6 text-2xl text-wood-600">
              {formatPrice(product.price, product.priceFrom)}
            </p>

            <p className="mt-6 leading-relaxed text-graphite-600">{product.description}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/kontakty">Оставить заявку на расчёт</ButtonLink>
              {product.price != null && (
                <AddToCartButton
                  item={{
                    productId: product.id,
                    slug: product.slug,
                    title: product.title,
                    price: product.price,
                    qty: 1,
                    image: product.images[0]?.url,
                  }}
                />
              )}
            </div>

            <p className="mt-6 text-sm text-graphite-400">
              Точную стоимость рассчитываем индивидуально по вашим размерам. Срок изготовления 4–8 недель.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
