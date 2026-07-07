"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { Container } from "@/components/ui/Container";
import { MobileNav } from "@/components/layout/MobileNav";

export const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/katalog/kuhni", label: "Кухни" },
  { href: "/katalog/korpusnaya-mebel", label: "Корпусная мебель" },
  { href: "/fasady", label: "Фасады" },
  { href: "/uslugi", label: "Услуги" },
  { href: "/akcii", label: "Акции" },
  { href: "/o-nas", label: "О нас" },
  { href: "/kontakty", label: "Контакты" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = useCart((s) => s.count());

  return (
    <header className="sticky top-0 z-40 border-b border-wood-100 bg-cream-50/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-heading text-2xl text-graphite-800">Симфония мебели</span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-wood-500">
            кухни · корпусная мебель
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.slice(1).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-graphite-600 transition-colors hover:text-wood-600"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/korzina"
            className="relative text-sm text-graphite-700 hover:text-wood-600"
            aria-label="Корзина"
          >
            Корзина
            {count > 0 && (
              <span className="absolute -right-4 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-wood-500 px-1 text-[11px] text-cream-50">
                {count}
              </span>
            )}
          </Link>
          <button
            className="lg:hidden text-graphite-700"
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть меню"
          >
            ☰
          </button>
        </div>
      </Container>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
