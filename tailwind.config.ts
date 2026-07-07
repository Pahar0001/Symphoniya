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
        paper: "var(--paper)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        walnut: "var(--walnut)",
        brass: "var(--brass)",
        "brass-soft": "var(--brass-soft)",
        // Легаси-алиасы (см. globals.css) — для страниц, ещё не переведённых на семантику.
        cream: { 50: "var(--c-50)", 100: "var(--c-100)", 200: "var(--c-200)", 300: "var(--c-200)" },
        graphite: {
          300: "var(--g-300)", 400: "var(--g-400)", 500: "var(--g-500)", 600: "var(--g-600)",
          700: "var(--g-700)", 800: "var(--g-800)", 900: "var(--g-900)",
        },
        wood: {
          100: "var(--w-100)", 200: "var(--w-200)", 300: "var(--w-300)",
          400: "var(--w-400)", 500: "var(--w-500)", 600: "var(--w-600)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "serif"],
        body: ["var(--font-body)", "Manrope", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      maxWidth: { container: "82rem" },
      spacing: { section: "7rem" },
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
