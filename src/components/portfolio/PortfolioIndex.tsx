import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import type { PortfolioItem } from "@prisma/client";
import { catLabel } from "@/lib/portfolio-categories";

// Мозаика проектов с ориентированием по ЖК: крупные фото в 2 колонки,
// на каждом — жилой комплекс, название и ветка (референс: neapol-design.ru).
export function PortfolioIndex({ items }: { items: PortfolioItem[] }) {
  if (items.length === 0) {
    return <p className="label">Работы скоро появятся.</p>;
  }
  return (
    <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
      {items.map((it, i) => (
        <Reveal key={it.id}>
          <Link
            href={`/portfolio/${it.id}`}
            data-cursor="Открыть"
            className="group mb-5 block break-inside-avoid overflow-hidden"
          >
            <figure className="relative m-0 overflow-hidden bg-surface-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.image}
                alt={it.title}
                loading={i < 4 ? "eager" : "lazy"}
                className="w-full object-cover transition-transform duration-[1.6s] ease-symphony group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white [text-shadow:0_1px_16px_rgba(0,0,0,0.6)] sm:p-8">
                {it.complex && (
                  <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-white/90">
                    ЖК {it.complex}
                  </div>
                )}
                <div className="mt-1.5 font-display text-2xl leading-tight tracking-tight sm:text-3xl">
                  {it.title}
                </div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
                  {[catLabel(it.category), it.city, it.year].filter(Boolean).join(" · ")}
                </div>
              </figcaption>
            </figure>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
