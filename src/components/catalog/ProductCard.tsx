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
      data-cursor
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-all duration-500 ease-symphony hover:-translate-y-1 hover:border-brass/60 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={product.images[0]?.alt ?? product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-symphony group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center font-mono text-xs uppercase tracking-widest text-muted">
            фото скоро
          </div>
        )}
        {product.isPromo && (
          <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-brass backdrop-blur">
            Акция
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {product.style && (
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{product.style}</span>
        )}
        <h3 className="mt-2 font-display text-xl leading-snug text-ink">{product.title}</h3>
        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="text-lg text-brass">{formatPrice(product.price, product.priceFrom)}</span>
          <span className="translate-x-0 text-muted transition-transform duration-500 ease-symphony group-hover:translate-x-1 group-hover:text-brass">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
