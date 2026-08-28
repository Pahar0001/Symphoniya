import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { HERO_IMAGE, HERO_IMAGE_ALT } from "@/lib/site-config";

// Hero: горизонтальное фото 16:9 (2560×1440) на всю ширину экрана.
// Контейнер тоже 16:9 → фото показывается ЦЕЛИКОМ: без обрезки, без сжатия и без
// чёрных полос на любом мониторе. Текст лежит РОВНО ПОВЕРХ фото (слева внизу),
// читаемость даёт мягкий градиент. На десктопе шапка прозрачно лежит поверх фото.
export function HeroR100() {
  return (
    <section className="relative w-full lg:-mt-[136px]">
      <div className="relative w-full overflow-hidden aspect-[16/9]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE}
          alt={HERO_IMAGE_ALT}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Градиент для читаемости надписей поверх фото */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/35" />

        {/* Надписи — ровно поверх фото, слева внизу */}
        <div className="absolute inset-0 flex items-end">
          <div className="container-x w-full pb-7 sm:pb-12 lg:pb-16">
            <Reveal>
              <p className="hidden font-mono text-[0.7rem] uppercase tracking-[0.28em] text-white/80 sm:block">
                Мебель · Архитектура · Москва и область
              </p>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="mt-3 max-w-3xl font-display text-[clamp(1.55rem,4.4vw,4.4rem)] font-medium leading-[1.04] tracking-tightest text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.45)]">
                Мебель на заказ в Москве и области
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-4 hidden max-w-xl text-base leading-relaxed text-white/85 sm:block lg:text-lg">
                Кухни, шкафы, гардеробные и сан-узлы — спроектированные как архитектура,
                под ваше пространство и сценарий жизни.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
                <Link
                  href="/kontakty"
                  className="group inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-transform duration-500 ease-symphony hover:-translate-y-0.5 sm:px-7 sm:py-3.5"
                >
                  Рассчитать проект
                  <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="#projects"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-500 hover:bg-white/10 sm:px-7 sm:py-3.5"
                >
                  Смотреть проекты
                  <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
