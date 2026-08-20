"use client";

import { useEffect } from "react";

// Одноразовая отправка события аналитики при монтировании (напр. project_view).
export function TrackEvent({
  type,
  meta,
}: {
  type: string;
  meta?: Record<string, unknown>;
}) {
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;
    try {
      const body = JSON.stringify({ type, path: location.pathname, meta });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics/track", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/analytics/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
      }
    } catch {
      /* тихо */
    }
    // один раз на монтирование
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
