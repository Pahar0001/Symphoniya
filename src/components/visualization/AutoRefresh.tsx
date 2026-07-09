"use client";

import { useEffect } from "react";

// Перезагружает страницу через заданное число секунд — для ожидания готовности рендера.
export function AutoRefresh({ seconds = 6 }: { seconds?: number }) {
  useEffect(() => {
    const t = setTimeout(() => window.location.reload(), seconds * 1000);
    return () => clearTimeout(t);
  }, [seconds]);
  return null;
}
