import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { HERO_IMAGE, HERO_IMAGE_ALT } from "@/lib/site-config";

// Full-bleed hero: одно фото на всю ширину экрана, поверх него — шапка и текст.
// Фото задаётся ОДНИМ источником — HERO_IMAGE (см. src/lib/site-config.ts).
// Отрицательный верхний отступ уводит фото под «липкую» прозрачную шапку,
// чтобы получилась единая композиция «интерфейс поверх фотографии».
export function HeroR100() {
  return (
    <section className="relative isolate -mt-20 flex min-h-[92svh] items-end overflow-hidden sm:-mt-24 lg:min-h-screen">
      {/* Фон — главное фото (заменяется через HERO_IMAGE) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE}
        alt={HERO_IMAGE_ALT}
        fetchPriority="high"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      {/* Деликатный градиент: читаемость шапки сверху и текста снизу */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/15 to-black/65" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_85%_at_18%_100%,transparent_45%,rgba(0,0,0,0.4))]" />

      <div className="container-x relative z-10 pb-16 pt-36 sm:pb-24 sm:pt-44">
        <Reveal>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-white/75">
            Мебель · Архитектура · Москва и область
          </p>
        </Reveal>
        <Reveal delay={90}>
          <h1 className="mt-5 max-w-4xl text-balance font-display text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[0.98] tracking-tightest text-white">
            Мебель на заказ
            <br className="hidden sm:block" /> в Москве и области
          </h1>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            Кухни, шкафы, гардеробные и сан-узлы — спроектированные как архитектура,
            под ваше пространство и сценарий жизни.
          </p>
        </Reveal>
        <Reveal delay={260}>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/kontakty"
              className="group inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink shadow-soft transition-transform duration-500 ease-symphony hover:-translate-y-0.5"
            >
              Рассчитать проект
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-500 hover:border-white/80"
            >
              Смотреть проекты
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
