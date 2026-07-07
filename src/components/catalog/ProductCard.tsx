import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductWithImages } from "@/types";

// Единый стиль карточки товара во всех категориях.
export function ProductCard({
  product,
  categorySlug,
}: {
  product: ProductWithImages;
  categorySlug: string;
}) {
  const img = product.images[0]?.url;
  return (
    <Link
      href={`/katalog/${categorySlug}/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-wood-100 bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={product.images[0]?.alt ?? product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-graphite-300">
            фото скоро
          </div>
        )}
        {product.isPromo && (
          <span className="absolute left-3 top-3 rounded-full bg-wood-500 px-3 py-1 text-xs text-cream-50">
            Акция
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-xl text-graphite-800">{product.title}</h3>
        {product.style && (
          <p className="mt-1 text-sm text-graphite-400">{product.style}</p>
        )}
        <p className="mt-auto pt-4 text-lg text-wood-600">
          {formatPrice(product.price, product.priceFrom)}
        </p>
      </div>
    </Link>
  );
}
