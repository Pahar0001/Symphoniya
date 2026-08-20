import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { GridOverlay } from "@/components/layout/GridOverlay";

// Кадры героя сменяют друг друга (файлы на сервере /opt/symphony/uploads).
const HERO_IMAGES = [
  "/uploads/hero-1.jpg",
  "/uploads/hero-2.jpg",
  "/uploads/hero-3.jpg",
  "/uploads/hero-5.jpg",
  "/uploads/hero-6.jpg",
  "/uploads/hero-7.jpg",
  "/uploads/hero-8.jpg",
  "/uploads/hero-9.jpg",
  "/uploads/hero-10.jpg",
];

// R100-герой: минимум UI, максимум композиции. Огромный гротеск, сетка,
// сменяющиеся фотографии мебели.
export function HeroR100() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <GridOverlay />
      <div className="container-x relative z-10">
        <div className="grid items-center gap-10 py-12 lg:min-h-[82vh] lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 text-center">
            <h1 className="sr-only">Симфония мебели — кухни, шкафы, гардеробные и сан-узлы на заказ</h1>
            <Reveal delay={120}>
              <p className="mt-8 mx-auto max-w-lg text-lg leading-relaxed text-muted lg:text-xl">
                Мебель, созданная для пространства. Кухни, шкафы, гардеробные и сан-узлы на заказ —
                спроектированные как&nbsp;архитектура.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                <Link
                  href="#projects"
                  className="group inline-flex items-center gap-2 border-b border-ink pb-1 font-mono text-xs uppercase tracking-[0.2em] text-ink"
                >
                  Смотреть проекты
                  <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/kontakty"
                  className="group inline-flex items-center gap-2 border-b border-transparent pb-1 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:border-line hover:text-ink"
                >
                  Обсудить проект
                  <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={160}>
              <figure data-cursor="Смотреть" className="relative m-0">
                <HeroSlideshow images={HERO_IMAGES} className="aspect-[4/5]">
                  <figcaption className="label absolute bottom-4 left-4 z-10 rounded-full bg-paper/85 px-3 py-1 text-ink backdrop-blur-sm">
                    Мебель на заказ
                  </figcaption>
                </HeroSlideshow>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
