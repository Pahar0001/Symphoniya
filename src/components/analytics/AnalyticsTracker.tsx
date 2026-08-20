"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Внутренние разделы не считаем трафиком сайта.
const IGNORED = ["/admin", "/login", "/register", "/account"];

function send(payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify(payload);
    // sendBeacon переживает уход со страницы; fetch — запасной путь.
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    /* аналитика молчит при ошибке */
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Уважаем Do-Not-Track.
    if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;
    if (!pathname || IGNORED.some((p) => pathname.startsWith(p))) return;

    send({ type: "page_view", path: pathname, referrer: document.referrer || null });

    // Глубина прокрутки: 25 / 50 / 75 / 100 — по разу на страницу.
    const fired = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 100;
      for (const d of [25, 50, 75, 100]) {
        if (pct >= d && !fired.has(d)) {
          fired.add(d);
          send({ type: "scroll", path: pathname, meta: { depth: d } });
        }
      }
      if (fired.size >= 4) window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Делегированный сбор кликов по CTA: любой элемент с data-cta="…".
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("[data-cta]") as HTMLElement | null;
      if (!el) return;
      send({
        type: "cta_click",
        path: location.pathname,
        referrer: document.referrer || null,
        meta: { cta: el.getAttribute("data-cta") },
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
