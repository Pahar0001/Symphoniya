"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

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
  const [scrolled, setScrolled] = useState(false);
  const count = useCart((s) => s.count());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-500 ${
        scrolled ? "border-line bg-paper/85 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 leading-none" aria-label="Симфония мебели">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-brass/50 font-display text-lg text-brass">
            С
          </span>
          <span className="flex flex-col">
            <span className="font-display text-xl tracking-tight text-ink">Симфония мебели</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
              кухни · корпусная мебель
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.slice(1).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative text-sm text-muted transition-colors hover:text-ink"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-brass transition-all duration-500 ease-symphony group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/korzina"
            className="relative grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brass"
            aria-label="Корзина"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6L5 3H2" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-brass px-1 font-mono text-[10px] text-paper">
                {count}
              </span>
            )}
          </Link>
          <button
            className="grid h-9 w-9 place-items-center text-ink lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть меню"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
