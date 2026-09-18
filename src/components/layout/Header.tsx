"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { PORTFOLIO_CATEGORIES } from "@/lib/portfolio-categories";
import { salonMapUrl, shortAddress, telHref, type SiteSettings } from "@/lib/site-config";

const BRANCHES = PORTFOLIO_CATEGORIES.map((c) => ({ href: `/portfolio?cat=${c.slug}`, label: c.label }));

// Полный список — для мобильного меню и футера.
export const NAV_LINKS = [
  { href: "/", label: "Главная" },
  ...BRANCHES,
  { href: "/portfolio?cat=zhk", label: "ЖК" },
  { href: "/portfolio", label: "Все проекты" },
  { href: "/fasady", label: "Материалы" },
  { href: "/otzyvy", label: "Отзывы" },
  { href: "/o-nas", label: "О нас" },
  { href: "/garantiya", label: "Гарантия" },
  { href: "/faq", label: "Вопросы и ответы" },
  { href: "/kontakty", label: "Контакты" },
];

// Десктопная шапка: ветки + ЖК + о нас.
const NAV_DESKTOP = [
  ...BRANCHES,
  { href: "/portfolio?cat=zhk", label: "ЖК" },
  { href: "/o-nas", label: "О нас" },
];

export function Header({ settings }: { settings: SiteSettings }) {
  const { salons, hours } = settings;
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
  // Поверх фото — чистый белый с мягкой тенью: тонкий моно-шрифт иначе теряется на светлых участках.
  const shadowCls = overlay ? "lg:[text-shadow:0_1px_10px_rgba(0,0,0,0.55)]" : "";
  const linkCls = overlay ? "text-white hover:text-white/75" : "text-ink/75 hover:text-ink";
  const underlineCls = overlay ? "bg-white" : "bg-ink";
  const barTextCls = overlay ? "text-ink/75 lg:text-white" : "text-ink/75";
  const barHover = overlay ? "hover:text-ink lg:hover:text-white/75" : "hover:text-ink";
  const dividerCls = overlay ? "border-line lg:border-white/20" : "border-line";

  return (
    <>
    <header
      className={`sticky top-0 z-40 transition-colors duration-500 ${
        overlay
          ? "border-b border-line bg-paper/90 backdrop-blur-md lg:border-transparent lg:bg-transparent lg:backdrop-blur-none"
          : "border-b border-line bg-paper/90 backdrop-blur-md"
      }`}
    >
      {/* Верхняя полоса: адреса салонов → Яндекс.Карты · часы · телефоны.
          Высота полосы прежняя (h-10) — крупнее стал только шрифт. */}
      <div className={`border-b ${dividerCls}`}>
        <div className={`container-x flex h-10 items-center justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.06em] xl:text-[13px] ${barTextCls} ${shadowCls}`}>
          <div className="flex min-w-0 items-center gap-5">
            {salons.map((salon, i) => (
              <a
                key={salon.address}
                href={salonMapUrl(salon)}
                target="_blank"
                rel="noopener noreferrer"
                className={`items-center gap-1.5 whitespace-nowrap py-1 transition-colors ${barHover} ${i === 0 ? "inline-flex" : "hidden lg:inline-flex"}`}
                title="Открыть на Яндекс.Картах"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span className="hidden sm:inline">{shortAddress(salon.address)}</span>
                <span className="sm:hidden">На карте</span>
              </a>
            ))}
          </div>
          <div className="flex items-center gap-5 whitespace-nowrap">
            <span className="hidden xl:inline">{hours}</span>
            {salons.map((salon, i) => (
              <a
                key={salon.phone}
                href={telHref(salon.phone)}
                className={`transition-colors ${barHover} ${i === 0 ? "" : "hidden md:inline"}`}
              >
                {salon.phone}
              </a>
            ))}
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
              className={`group relative font-mono text-[13px] uppercase tracking-[0.12em] transition-colors ${linkCls} ${shadowCls}`}
            >
              {l.label}
              <span className={`absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-500 ease-symphony group-hover:w-full ${underlineCls}`} />
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <ThemeToggle className={overlay ? "lg:border-white/60 lg:text-white" : ""} />
          <Link
            href="/kontakty"
            className={`group hidden items-center gap-1.5 border-b pb-0.5 font-mono text-[13px] uppercase tracking-[0.12em] lg:inline-flex ${shadowCls} ${
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
