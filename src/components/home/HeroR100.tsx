import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { HERO_IMAGE, HERO_IMAGE_ALT } from "@/lib/site-config";

// Hero: фото в СВОЁЙ пропорции 16:9 на всю ширину экрана.
// Контейнер = 16:9, картинка 16:9 (1920×1080) → показывается ЦЕЛИКОМ,
// без обрезки и без чёрных полос на любом мониторе. Крупный текст — под фото
// (наложение поверх несовместимо с «видно целиком» на мобильных/1080p).
// Шапка на десктопе прозрачно лежит поверх верхней части фото.
export function HeroR100() {
  return (
    <section className="relative w-full lg:-mt-[136px]">
      {/* Фото 16:9 — всегда целиком, без полос, на всю ширину */}
      <div className="relative w-full overflow-hidden aspect-[16/9]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE}
          alt={HERO_IMAGE_ALT}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Лёгкое затемнение вверху — чтобы читалась прозрачная шапка (только desktop) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-56 bg-gradient-to-b from-black/45 to-transparent lg:block" />
      </div>

      {/* Текст под фото: заголовок, подзаголовок, CTA */}
      <div className="border-b border-line bg-paper">
        <div className="container-x py-10 sm:py-14">
          <Reveal>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-muted">
              Мебель · Архитектура · Москва и область
            </p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-4 max-w-4xl text-balance font-display text-[clamp(2rem,5vw,4.4rem)] font-medium leading-[1] tracking-tightest text-ink">
              Мебель на заказ в Москве и области
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Кухни, шкафы, гардеробные и сан-узлы — спроектированные как архитектура,
              под ваше пространство и сценарий жизни.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/kontakty"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-transform duration-500 ease-symphony hover:-translate-y-0.5"
              >
                Рассчитать проект
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors duration-500 hover:border-ink"
              >
                Смотреть проекты
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
