"use client";

import { useEffect, useRef, useState } from "react";

export type Slide = { src: string; title: string; tag: string; complex?: string };

// Полноэкранная галерея в духе r-100.no.
// Desktop: вертикальная прокрутка «переводится» в горизонтальное движение ленты
// (scroll-jack с закреплением). Когда лента заканчивается — страница продолжает
// листаться вниз к остальному контенту.
// Mobile / reduced-motion: нативная горизонтальная лента со snap (свайп).
export function HeroGallery({ slides }: { slides: Slide[] }) {
  const outerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"native" | "pinned">("native"); // SSR = native, апгрейд на клиенте
  const [outerHeight, setOuterHeight] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  // 1) Определяем режим на клиенте.
  useEffect(() => {
    const fine = matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(fine && !reduce ? "pinned" : "native");
  }, []);

  // 2) Вешаем scroll-jack ТОЛЬКО когда закреплённая разметка уже смонтирована
  //    (иначе refs ещё null и слушатель не навесится).
  useEffect(() => {
    if (mode !== "pinned") return;
    const track = trackRef.current;
    const outer = outerRef.current;
    if (!track || !outer) return;

    let distance = 0;
    const measure = () => {
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      setOuterHeight(distance + window.innerHeight);
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const start = outer.offsetTop;
      const p = distance > 0 ? (window.scrollY - start) / distance : 0;
      const clamped = Math.min(1, Math.max(0, p));
      track.style.transform = `translate3d(${-clamped * distance}px,0,0)`;
      setProgress(clamped);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    // изображения могут прийти позже — пересчитываем после загрузки
    const imgs = track.querySelectorAll("img");
    imgs.forEach((img) => img.addEventListener("load", measure, { once: true }));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mode, slides.length]);

  // Аналитика: вход в горизонтальную сцену — один раз.
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;
    const el = document.querySelector('section[aria-label="Галерея работ"]');
    if (!el) return;
    let sent = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !sent) {
            sent = true;
            try {
              const body = JSON.stringify({ type: "horizontal_enter", path: location.pathname });
              navigator.sendBeacon?.("/api/analytics/track", new Blob([body], { type: "application/json" }));
            } catch {
              /* тихо */
            }
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Slides = (
    <>
      {slides.map((s, i) => (
        <figure
          key={s.src}
          data-cursor="Проект"
          className="group relative m-0 aspect-[3/4] h-[58svh] shrink-0 snap-start overflow-hidden rounded-xl sm:h-[68vh]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.src}
            alt={s.title}
            draggable={false}
            loading={i < 2 ? "eager" : "lazy"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white sm:p-8">
            <div className="[text-shadow:0_1px_16px_rgba(0,0,0,0.6)]">
              {s.complex && (
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/85">ЖК {s.complex}</div>
              )}
              <div className="mt-1 font-display text-2xl leading-tight sm:text-3xl">{s.title}</div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-white/70">{s.tag}</div>
            </div>
          </figcaption>
        </figure>
      ))}
    </>
  );

  // Наложение: бренд + подсказка прокрутки.
  const Overlay = (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink/70">Симфония мебели</div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            мебель на заказ
          </div>
        </div>
      </div>
    </div>
  );

  if (mode === "native") {
    return (
      <section aria-label="Галерея работ" className="relative">
        {Overlay}
        <div className="flex h-[86svh] items-center snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-3 pt-20 [scrollbar-width:none] sm:gap-5 sm:px-6 [&::-webkit-scrollbar]:hidden">
          {Slides}
        </div>
      </section>
    );
  }

  // pinned (desktop scroll-jack)
  return (
    <section
      ref={outerRef}
      aria-label="Галерея работ"
      className="relative"
      style={{ height: outerHeight ? `${outerHeight}px` : "100vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {Overlay}
        <div
          ref={trackRef}
          className="flex h-screen items-center gap-5 px-6 pb-6 pt-24 will-change-transform"
        >
          {Slides}
        </div>
        {/* индикатор прокрутки */}
        <div className="absolute inset-x-10 bottom-6 z-10 hidden h-px bg-ink/15 lg:block">
          <div className="h-px origin-left bg-ink/70" style={{ transform: `scaleX(${0.04 + progress * 0.96})` }} />
        </div>
      </div>
    </section>
  );
}
