"use client";

import Link from "next/link";
import { useEffect } from "react";
import { NAV_LINKS } from "@/components/layout/Header";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Пока меню открыто — блокируем прокрутку фона (иначе скроллится страница под меню).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;
  return (
    // flex-col + прокручиваемый <nav> ниже — чтобы длинный список меню скроллился
    // на коротких экранах (раньше overflow отсутствовал, и нижние пункты были недоступны).
    <div className="fixed inset-0 z-50 flex flex-col bg-paper lg:hidden">
      <div className="container-x flex h-20 shrink-0 items-center justify-between border-b border-line">
        <span className="font-display text-xl text-ink">Меню</span>
        <button
          onClick={onClose}
          aria-label="Закрыть меню"
          className="-mr-2 grid h-11 w-11 place-items-center text-2xl text-ink"
        >
          ×
        </button>
      </div>
      <nav className="container-x flex flex-1 flex-col overflow-y-auto overscroll-contain pb-[max(2rem,env(safe-area-inset-bottom))]">
        {NAV_LINKS.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClose}
            className="flex items-center gap-4 border-b border-line py-3.5 text-lg text-ink"
          >
            <span className="font-mono text-xs text-brass">{String(i + 1).padStart(2, "0")}</span>
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
