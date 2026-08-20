"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { PORTFOLIO_CATEGORIES } from "@/lib/portfolio-categories";

const BRANCHES = PORTFOLIO_CATEGORIES.map((c) => ({ href: `/portfolio?cat=${c.slug}`, label: c.label }));

// Полный список — для мобильного меню и футера.
export const NAV_LINKS = [
  { href: "/", label: "Главная" },
  ...BRANCHES,
  { href: "/portfolio", label: "Все проекты" },
  { href: "/fasady", label: "Материалы" },
  { href: "/stati", label: "Журнал" },
  { href: "/uslugi", label: "Услуги" },
  { href: "/otzyvy", label: "Отзывы" },
  { href: "/o-nas", label: "О нас" },
  { href: "/garantiya", label: "Гарантия" },
  { href: "/faq", label: "Вопросы и ответы" },
  { href: "/kontakty", label: "Контакты" },
];

// Десктопная шапка: ветки + журнал + о нас.
const NAV_DESKTOP = [...BRANCHES, { href: "/stati", label: "Журнал" }, { href: "/o-nas", label: "О нас" }];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-500 ${
        scrolled ? "border-line bg-paper/90" : "border-transparent bg-paper/70"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-6">
        {/* Вордмарк */}
        <Link href="/" className="flex items-baseline gap-2.5 leading-none" aria-label="Симфония мебели">
          <span className="font-display text-xl font-semibold uppercase tracking-tight text-ink">Симфония</span>
          <span className="label hidden sm:inline">мебели</span>
        </Link>

        {/* Навигация — моно-лейблы */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex">
          {NAV_DESKTOP.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative font-mono text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-ink transition-all duration-500 ease-symphony group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Действия */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/kontakty"
            className="group hidden items-center gap-1.5 border-b border-ink pb-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink lg:inline-flex"
          >
            Контакты
            <span className="transition-transform duration-500 group-hover:translate-x-0.5">→</span>
          </Link>
          <button
            className="grid h-9 w-9 place-items-center text-ink lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть меню"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
