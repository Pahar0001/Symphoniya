import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import type { PortfolioItem } from "@prisma/client";
import { catLabel } from "@/lib/portfolio-categories";

// Сетка проектов с ориентированием по ЖК. Все карточки ОДНОГО формата (3:4 — как
// большинство фото заказчика) и умеренного размера: карточка целиком помещается
// в экран. На каждой — жилой комплекс, название и ветка.
export function PortfolioIndex({ items }: { items: PortfolioItem[] }) {
  if (items.length === 0) {
    return <p className="label">Работы скоро появятся.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((it, i) => (
        <Reveal key={it.id}>
          <Link
            href={`/portfolio/${it.id}`}
            data-cursor="Открыть"
            className="group block overflow-hidden"
          >
            <figure className="relative m-0 aspect-[3/4] overflow-hidden bg-surface-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.image}
                alt={it.title}
                loading={i < 4 ? "eager" : "lazy"}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-symphony group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white [text-shadow:0_1px_16px_rgba(0,0,0,0.6)] sm:p-6">
                {it.complex && (
                  <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-white/90">
                    ЖК {it.complex}
                  </div>
                )}
                <div className="mt-1.5 font-display text-xl leading-tight tracking-tight sm:text-2xl">
                  {it.title}
                </div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
                  {it.category === "zhk" && it.zones?.length
                    ? it.zones.join(" · ")
                    : [catLabel(it.category), it.city, it.year].filter(Boolean).join(" · ")}
                </div>
              </figcaption>
            </figure>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
