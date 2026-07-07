"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

// Тумблер темы: солнце/луна, плавная смена.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Светлая тема" : "Тёмная тема"}
      className={`group relative grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brass ${className}`}
    >
      <span className="relative block h-4 w-4">
        {/* Солнце */}
        <svg
          viewBox="0 0 24 24"
          className={`absolute inset-0 h-4 w-4 transition-all duration-500 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        {/* Луна */}
        <svg
          viewBox="0 0 24 24"
          className={`absolute inset-0 h-4 w-4 transition-all duration-500 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
          fill="currentColor"
        >
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
        </svg>
      </span>
    </button>
  );
}
