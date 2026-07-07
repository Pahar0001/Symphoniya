"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/components/layout/Header";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-cream-50 lg:hidden">
      <div className="flex h-20 items-center justify-between px-5">
        <span className="font-heading text-xl text-graphite-800">Меню</span>
        <button onClick={onClose} aria-label="Закрыть меню" className="text-2xl text-graphite-700">
          ×
        </button>
      </div>
      <nav className="flex flex-col gap-1 px-5">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClose}
            className="border-b border-wood-100 py-4 text-lg text-graphite-700"
          >
            {l.label}
          </Link>
        ))}
        <Link href="/korzina" onClick={onClose} className="py-4 text-lg text-wood-600">
          Корзина
        </Link>
      </nav>
    </div>
  );
}
