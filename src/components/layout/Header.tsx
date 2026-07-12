"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

// Полный список — для мобильного меню и футера.
export const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/katalog/kuhni", label: "Кухни" },
  { href: "/katalog/korpusnaya-mebel", label: "Корпусная мебель" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/raschet", label: "Расчёт" },
  { href: "/fasady", label: "Фасады" },
  { href: "/stati", label: "Статьи" },
  { href: "/uslugi", label: "Услуги" },
  { href: "/akcii", label: "Акции" },
  { href: "/otzyvy", label: "Отзывы" },
  { href: "/o-nas", label: "О нас" },
  { href: "/garantiya", label: "Гарантия" },
  { href: "/faq", label: "Вопросы и ответы" },
  { href: "/kontakty", label: "Контакты" },
];

// Курированный набор для десктопной шапки (чтобы не переполнять строку).
const NAV_DESKTOP = [
  { href: "/katalog/kuhni", label: "Кухни" },
  { href: "/katalog/korpusnaya-mebel", label: "Корпус" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/raschet", label: "Расчёт" },
  { href: "/stati", label: "Статьи" },
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
      className={`sticky top-0 z-40 border-b border-line backdrop-blur-md transition-all duration-500 ${
        scrolled
          ? "bg-paper/95 shadow-[0_6px_28px_-18px_rgba(0,0,0,0.55)]"
          : "bg-paper/85"
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

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_DESKTOP.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative text-sm font-medium text-ink/75 transition-colors hover:text-ink"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-brass transition-all duration-500 ease-symphony group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/account"
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brass"
            aria-label="Личный кабинет"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5 20a7 7 0 0114 0" />
            </svg>
          </Link>
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
