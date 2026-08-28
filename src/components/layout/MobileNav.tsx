"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/components/layout/Header";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-paper lg:hidden">
      <div className="container-x flex h-20 items-center justify-between">
        <span className="font-display text-xl text-ink">Меню</span>
        <button onClick={onClose} aria-label="Закрыть меню" className="text-2xl text-ink">
          ×
        </button>
      </div>
      <nav className="container-x flex flex-col">
        {NAV_LINKS.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClose}
            className="flex items-center gap-4 border-b border-line py-4 text-lg text-ink"
          >
            <span className="font-mono text-xs text-brass">{String(i + 1).padStart(2, "0")}</span>
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
