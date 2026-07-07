import type { Config } from "tailwindcss";

// Значения синхронизированы с design/tokens.json.
// После генерации макета в Figma обновлять оба файла вместе.
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50: "#faf6f0",
          100: "#f1e7d8",
          200: "#e2ccae",
          300: "#cfa97c",
          400: "#bd8c53",
          500: "#a5763f",
          600: "#875e33",
          700: "#6a4a2c",
          800: "#553d27",
          900: "#473324",
        },
        graphite: {
          50: "#f4f4f5",
          100: "#e7e7e9",
          200: "#c9c9cd",
          300: "#a3a3aa",
          400: "#71717a",
          500: "#52525b",
          600: "#3f3f46",
          700: "#2e2e34",
          800: "#1f1f23",
          900: "#161619",
        },
        cream: {
          50: "#fdfcf9",
          100: "#faf7f0",
          200: "#f4eee1",
          300: "#ece2cd",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Cormorant Garamond", "serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      maxWidth: {
        container: "80rem",
      },
      spacing: {
        section: "6rem",
      },
      borderRadius: {
        md: "0.625rem",
        lg: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
