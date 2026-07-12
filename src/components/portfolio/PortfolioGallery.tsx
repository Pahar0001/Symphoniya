import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import type { PortfolioItem } from "@prisma/client";

// Bento-галерея выполненных работ с мягким зумом фото при наведении.
function span(i: number): string {
  if (i % 6 === 0) return "sm:col-span-2 lg:col-span-2 lg:row-span-2";
  if (i % 6 === 3) return "lg:col-span-2";
  return "";
}

export function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  if (items.length === 0) {
    return <p className="text-muted">Работы скоро появятся.</p>;
  }
  return (
    <div className="grid auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <Reveal key={it.id} delay={Math.min(i, 6) * 60} className={`${span(i)} min-h-0`}>
          <article className="group relative h-full overflow-hidden rounded-xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={it.image}
              alt={it.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-symphony group-hover:scale-[1.07]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.6)]">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-white/70">
                {it.city && <span>{it.city}</span>}
                {it.year && <span>{it.year}</span>}
                {it.material && <span>{it.material}</span>}
              </div>
              <h3 className="mt-1.5 font-display text-xl leading-tight">{it.title}</h3>
              {it.description && (
                <p className="mt-1 line-clamp-2 max-w-md text-sm text-white/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {it.description}
                </p>
              )}
            </div>
            <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/85 backdrop-blur">
              {it.category === "kuhni" ? "Кухня" : "Корпус"}
            </span>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
