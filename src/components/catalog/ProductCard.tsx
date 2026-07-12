import Link from "next/link";
import { formatPrice, articleFor } from "@/lib/format";
import type { ProductWithImages } from "@/types";

// Единый стиль карточки во всех категориях. `featured` — крупная флагманская карточка
// для bento-сетки. Контраст «редакционность vs данные»: serif-заголовок + моно-детали.
export function ProductCard({
  product,
  categorySlug,
  featured = false,
}: {
  product: ProductWithImages;
  categorySlug: string;
  featured?: boolean;
}) {
  const img = product.images[0]?.url;
  const article = articleFor(product.id);

  return (
    <Link
      href={`/katalog/${categorySlug}/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[transform,border-color,box-shadow] duration-500 ease-symphony hover:-translate-y-1 hover:border-brass/60 hover:shadow-[0_28px_60px_-28px_rgba(0,0,0,0.5)]"
    >
      <div className={`relative overflow-hidden bg-surface-2 ${featured ? "aspect-[16/11]" : "aspect-[4/3]"}`}>
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={product.images[0]?.alt ?? product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1.3s] ease-symphony group-hover:scale-[1.06]"
          />
        ) : (
          <div className="grid h-full place-items-center font-mono text-xs uppercase tracking-widest text-muted">
            фото скоро
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.28), transparent 55%)" }} />
        {product.isPromo && (
          <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-brass backdrop-blur">
            Флагман
          </span>
        )}
        {/* Артикул — моноширинные «данные» поверх фото */}
        <span className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-widest text-white/85 mix-blend-difference">
          {article}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {product.style && (
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">{product.style}</span>
        )}
        <h3 className={`mt-2 font-display leading-snug text-ink ${featured ? "text-2xl sm:text-3xl" : "text-xl"}`}>
          {product.title}
        </h3>

        {featured && (
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Технические данные — моноширинный ряд */}
        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted">
          {product.material && <span>{product.material}</span>}
          <span>Срок 4–8 нед</span>
        </dl>

        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="text-lg text-brass">{formatPrice(product.price, product.priceFrom)}</span>
          <span className="translate-x-0 text-muted transition-transform duration-500 ease-symphony group-hover:translate-x-1 group-hover:text-brass">→</span>
        </div>
      </div>
    </Link>
  );
}
