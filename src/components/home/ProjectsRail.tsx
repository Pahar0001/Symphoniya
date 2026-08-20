"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type RailProject = {
  id: string;
  title: string;
  image: string;
  category: string;
  city: string | null;
  year: number | null;
  material: string | null;
};

const CATEGORY_LABEL: Record<string, string> = {
  kuhni: "Кухни",
  shkafy: "Шкафы",
  garderobnye: "Гардеробные",
  sanuzly: "Сан-узлы",
};

// Горизонтальная лента проектов — «прогулка по галерее».
// Нативный scroll-snap работает и без JS; JS добавляет прогресс,
// колесо → горизонталь и перетаскивание мышью на десктопе.
export function ProjectsRail({ projects }: { projects: RailProject[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });

    // Вертикальное колесо прокручивает ленту по горизонтали (desktop).
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onWheel = (e: WheelEvent) => {
      if (!fine) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft >= max - 1 && e.deltaY > 0;
      if (atStart || atEnd) return; // отдаём прокрутку странице на краях
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  // Перетаскивание мышью (desktop).
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    const onDown = (e: PointerEvent) => {
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      down = false;
      if (moved) el.dataset.dragged = "1";
      else delete el.dataset.dragged;
    };
    const onClick = (e: MouseEvent) => {
      if (el.dataset.dragged) {
        e.preventDefault();
        delete el.dataset.dragged;
      }
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, []);

  if (projects.length === 0) return null;

  return (
    <section className="pt-section" aria-label="Избранные проекты">
      <div className="container-x">
        <div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-5">
          <div>
            <span className="eyebrow">Избранные проекты</span>
            <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl">
              Работы, которые уже живут
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="group hidden shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink sm:inline-flex"
          >
            Всё портфолио
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {/* Лента с краевым затуханием */}
      <div className="rail-mask">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-2 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((p, i) => (
            <Link
              key={p.id}
              href="/portfolio"
              className="group relative flex w-[78vw] shrink-0 snap-start flex-col sm:w-[42vw] lg:w-[27rem]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  draggable={false}
                  loading={i < 2 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-symphony group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                <span className="absolute left-5 top-5 font-mono text-xs text-white/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="absolute right-5 top-5 rounded-full bg-black/35 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/90 backdrop-blur-sm">
                  {CATEGORY_LABEL[p.category] ?? p.category}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.55)]">
                  <h3 className="font-display text-2xl leading-tight">{p.title}</h3>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-white/80">
                    {[p.city, p.year, p.material].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {/* Финальная карточка-приглашение */}
          <Link
            href="/portfolio"
            className="group flex w-[78vw] shrink-0 snap-start flex-col items-center justify-center rounded-xl border border-dashed border-line text-center sm:w-[42vw] lg:w-[22rem]"
          >
            <span className="font-display text-2xl text-ink transition-colors group-hover:text-brass">
              Смотреть все проекты
            </span>
            <span className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted">
              портфолио
              <span className="ml-2 inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Тонкий индикатор прокрутки */}
      <div className="container-x mt-6">
        <div className="h-px w-full max-w-40 bg-line">
          <div
            className="h-px origin-left bg-brass transition-transform duration-150"
            style={{ transform: `scaleX(${0.12 + progress * 0.88})` }}
          />
        </div>
      </div>
    </section>
  );
}
