import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteSettings } from "@/lib/site-config";

// Hero: горизонтальное фото 16:9 (2560×1440) на всю ширину экрана.
// Контейнер тоже 16:9 → фото показывается ЦЕЛИКОМ: без обрезки, без сжатия и без
// чёрных полос на любом мониторе. Текст лежит ПОВЕРХ фото слева: на десктопе —
// по центру высоты (чуть выше середины), на мобильном — внизу (фото там низкое).
// Читаемость даёт мягкий градиент слева. Надписи и фото правятся в /admin/site.
export function HeroR100({ hero }: { hero: SiteSettings["hero"] }) {
  return (
    <section className="relative w-full lg:-mt-[136px]">
      <div className="relative w-full overflow-hidden aspect-[16/9]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.image}
          alt={hero.imageAlt}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Затемнение: сверху — под шапку, слева — под надписи */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/30" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="container-x w-full pb-7 sm:pb-10 md:pb-0 lg:pt-[88px]">
            {hero.eyebrow && (
              <Reveal>
                <p className="hidden font-mono text-[0.78rem] uppercase tracking-[0.22em] text-white/90 sm:block">
                  {hero.eyebrow}
                </p>
              </Reveal>
            )}
            <Reveal delay={90}>
              <h1 className="mt-3 max-w-3xl text-balance font-display text-[clamp(1.55rem,4.4vw,4.4rem)] font-medium leading-[1.04] tracking-tightest text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.45)]">
                {hero.title}
              </h1>
            </Reveal>
            {hero.subtitle && (
              <Reveal delay={180}>
                <p className="mt-4 hidden max-w-xl text-base leading-relaxed text-white/90 sm:block lg:text-lg">
                  {hero.subtitle}
                </p>
              </Reveal>
            )}
            <Reveal delay={260}>
              <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
                <Link
                  href={hero.primaryHref}
                  className="group inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-transform duration-500 ease-symphony hover:-translate-y-0.5 sm:px-7 sm:py-3.5 sm:text-[12px]"
                >
                  {hero.primaryLabel}
                  <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </Link>
                {hero.secondaryLabel && hero.secondaryHref && (
                  <Link
                    href={hero.secondaryHref}
                    className="group inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-500 hover:bg-white/10 sm:px-7 sm:py-3.5 sm:text-[12px]"
                  >
                    {hero.secondaryLabel}
                    <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </Link>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
