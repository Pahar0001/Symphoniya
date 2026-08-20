import type { Config } from "tailwindcss";

// Тема управляется CSS-переменными (см. globals.css): светлая = :root, тёмная = .dark.
// Семантические токены (paper/surface/ink/…) дают дизайну работать в обеих темах
// без дублирования dark:-вариантов на каждом элементе.
const config: Config = {
  darkMode: "class",
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--paper) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        walnut: "rgb(var(--walnut) / <alpha-value>)",
        brass: "rgb(var(--brass) / <alpha-value>)",
        "brass-soft": "rgb(var(--brass-soft) / <alpha-value>)",
        // Легаси-алиасы (см. globals.css) — для страниц, ещё не переведённых на семантику.
        cream: {
          50: "rgb(var(--c-50) / <alpha-value>)", 100: "rgb(var(--c-100) / <alpha-value>)",
          200: "rgb(var(--c-200) / <alpha-value>)", 300: "rgb(var(--c-200) / <alpha-value>)",
        },
        graphite: {
          300: "rgb(var(--g-300) / <alpha-value>)", 400: "rgb(var(--g-400) / <alpha-value>)",
          500: "rgb(var(--g-500) / <alpha-value>)", 600: "rgb(var(--g-600) / <alpha-value>)",
          700: "rgb(var(--g-700) / <alpha-value>)", 800: "rgb(var(--g-800) / <alpha-value>)",
          900: "rgb(var(--g-900) / <alpha-value>)",
        },
        wood: {
          100: "rgb(var(--w-100) / <alpha-value>)", 200: "rgb(var(--w-200) / <alpha-value>)",
          300: "rgb(var(--w-300) / <alpha-value>)", 400: "rgb(var(--w-400) / <alpha-value>)",
          500: "rgb(var(--w-500) / <alpha-value>)", 600: "rgb(var(--w-600) / <alpha-value>)",
        },
      },
      fontFamily: {
        // R100 art-direction: единый гротеск (Geist) + моно для лейблов/номеров.
        display: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: { container: "88rem" },
      spacing: { section: "8rem" },
      letterSpacing: { tightest: "-0.045em" },
      borderRadius: { md: "0.5rem", lg: "1.25rem", xl: "1.75rem" },
      transitionTimingFunction: {
        symphony: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
