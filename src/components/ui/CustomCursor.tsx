"use client";

import { useEffect } from "react";

// R100 custom cursor: точка + контекстный лейбл (data-cursor="Открыть/Смотреть/…").
// Только desktop с мышью; отключается при reduced-motion и на touch.
export function CustomCursor() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const lab = document.createElement("div");
    lab.className = "cursor-label";
    document.body.append(dot, lab);
    document.documentElement.classList.add("has-cursor");

    let mx = innerWidth / 2, my = innerHeight / 2, lx = mx, ly = my, raf = 0;
    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };
    addEventListener("pointermove", onMove, { passive: true });

    const loop = () => {
      lx += (mx - lx) * 0.22;
      ly += (my - ly) * 0.22;
      dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
      lab.style.transform = `translate(calc(${lx}px - 50%), calc(${ly}px - 50%))`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const reset = () => {
      delete dot.dataset.hover;
      delete lab.dataset.on;
    };
    const onOver = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.("[data-cursor], a, button, [role='button']") as HTMLElement | null;
      if (!t) { reset(); return; }
      const label = t.getAttribute("data-cursor");
      if (label) {
        lab.textContent = label;
        lab.dataset.on = "1";
        dot.dataset.hover = "label";
      } else {
        delete lab.dataset.on;
        dot.dataset.hover = "link";
      }
    };
    addEventListener("pointerover", onOver, { passive: true });
    addEventListener("pointerout", (e) => { if (!(e as PointerEvent).relatedTarget) reset(); }, { passive: true });
    addEventListener("blur", reset);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerover", onOver);
      dot.remove();
      lab.remove();
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return null;
}
