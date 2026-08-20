import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import type { PortfolioItem } from "@prisma/client";
import { catLabel } from "@/lib/portfolio-categories";

// R100-индекс проектов: не карточки, а редакционные композиции.
// Крупное изображение пересекает сетку, номер, тонкие строки-такты.
export function PortfolioIndex({ items }: { items: PortfolioItem[] }) {
  if (items.length === 0) {
    return <p className="label">Работы скоро появятся.</p>;
  }
  return (
    <div>
      {items.map((it, i) => {
        const n = String(i + 1).padStart(2, "0");
        const meta = [catLabel(it.category), it.city, it.year, it.material].filter(Boolean).join(" · ");
        const imageLeft = i % 2 === 0;
        return (
          <Reveal key={it.id}>
            <Link
              href={`/portfolio/${it.id}`}
              data-cursor="Открыть"
              className="group grid items-center gap-6 border-t border-line py-8 lg:grid-cols-12 lg:gap-8 lg:py-12"
            >
              <figure
                className={`relative m-0 aspect-[16/10] overflow-hidden lg:col-span-8 ${
                  imageLeft ? "lg:order-1" : "lg:order-2"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.image}
                  alt={it.title}
                  loading={i < 2 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition-transform duration-[1.6s] ease-symphony group-hover:scale-[1.04]"
                />
                <span className="absolute left-5 top-5 num text-sm text-white/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
                  {n}
                </span>
              </figure>

              <div className={`lg:col-span-4 ${imageLeft ? "lg:order-2" : "lg:order-1"}`}>
                <div className="label mb-4 flex items-center gap-4">
                  <span className="text-ink/60">{n}</span>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <h2 className="font-display text-4xl leading-[0.98] tracking-tight text-ink transition-colors group-hover:text-brass sm:text-5xl">
                  {it.title}
                </h2>
                <div className="label mt-4">{meta}</div>
                {it.description && (
                  <p className="mt-4 max-w-md leading-relaxed text-muted">{it.description}</p>
                )}
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
                  Открыть проект
                  <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
