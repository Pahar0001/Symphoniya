"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { PORTFOLIO_CATEGORIES } from "@/lib/portfolio-categories";
import { COMPANY_ADDRESS, COMPANY_HOURS, COMPANY_MAP_URL, COMPANY_PHONE, COMPANY_PHONE_HREF } from "@/lib/site-config";

const BRANCHES = PORTFOLIO_CATEGORIES.map((c) => ({ href: `/portfolio?cat=${c.slug}`, label: c.label }));

// Полный список — для мобильного меню и футера.
export const NAV_LINKS = [
  { href: "/", label: "Главная" },
  ...BRANCHES,
  { href: "/portfolio?cat=zhk", label: "ЖК" },
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

// Десктопная шапка: ветки + ЖК + журнал + о нас.
const NAV_DESKTOP = [
  ...BRANCHES,
  { href: "/portfolio?cat=zhk", label: "ЖК" },
  { href: "/stati", label: "Журнал" },
  { href: "/o-nas", label: "О нас" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // На главной шапка «лежит» поверх фото Hero и прозрачна до скролла.
  const isHome = pathname === "/";
  const overlay = isHome && !scrolled;

  // Прозрачная шапка поверх фото — ТОЛЬКО на десктопе (lg+): там фото высокое.
  // На мобильном шапка всегда плотная (фото 16:9 короткое, иначе шапка перекроет его).
  // Навигация и «Контакты» видны только на lg+, поэтому им хватает overlay-цветов.
  const linkCls = overlay ? "text-white/80 hover:text-white" : "text-muted hover:text-ink";
  const underlineCls = overlay ? "bg-white" : "bg-ink";
  const barTextCls = overlay ? "text-muted lg:text-white/75" : "text-muted";
  const barHover = overlay ? "hover:text-ink lg:hover:text-white" : "hover:text-ink";
  const dividerCls = overlay ? "border-line lg:border-white/15" : "border-line";

  return (
    <>
    <header
      className={`sticky top-0 z-40 transition-colors duration-500 ${
        overlay
          ? "border-b border-line bg-paper/90 backdrop-blur-md lg:border-transparent lg:bg-transparent lg:backdrop-blur-none"
          : "border-b border-line bg-paper/90 backdrop-blur-md"
      }`}
    >
      {/* Верхняя полоса: адрес → Яндекс.Карты · часы · телефон */}
      <div className={`border-b ${dividerCls}`}>
        <div className={`container-x flex h-10 items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.14em] ${barTextCls}`}>
          <a
            href={COMPANY_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 py-1 transition-colors ${barHover}`}
            title="Открыть на Яндекс.Картах"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className="hidden sm:inline">{COMPANY_ADDRESS}</span>
            <span className="sm:hidden">На карте</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">{COMPANY_HOURS}</span>
            <a href={COMPANY_PHONE_HREF} className={`transition-colors ${barHover}`}>
              {COMPANY_PHONE}
            </a>
          </div>
        </div>
      </div>

      {/* Основной ряд: логотип · навигация · действия */}
      <div className="container-x flex h-20 items-center justify-between gap-6 sm:h-24">
        <Link href="/" className="flex shrink-0 items-center leading-none" aria-label="Симфония мебели">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-symphony.png"
            alt="Симфония мебели"
            className={`h-16 w-auto sm:h-20 ${overlay ? "dark:invert lg:[filter:invert(1)]" : "dark:invert"}`}
          />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex xl:gap-7">
          {NAV_DESKTOP.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`group relative font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${linkCls}`}
            >
              {l.label}
              <span className={`absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-500 ease-symphony group-hover:w-full ${underlineCls}`} />
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <ThemeToggle />
          <Link
            href="/kontakty"
            className={`group hidden items-center gap-1.5 border-b pb-0.5 font-mono text-[11px] uppercase tracking-[0.2em] lg:inline-flex ${
              overlay ? "border-white text-white" : "border-ink text-ink"
            }`}
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
    </header>
    {/* Мобильное меню — ВНЕ <header>: у шапки backdrop-blur создаёт containing block
        для fixed-потомков, из-за чего меню занимало лишь высоту шапки (не было фона). */}
    <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
