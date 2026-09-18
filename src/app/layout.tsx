import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: {
    default: "Симфония мебели — кухни и корпусная мебель на заказ",
    template: "%s · Симфония мебели",
  },
  description:
    "Симфония — мебель, спроектированная как архитектура. Кухни и корпусная мебель на заказ. Москва. Натуральные материалы, спокойный современный дизайн.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

// Устанавливаем тему до первой отрисовки — без «моргания».
const themeScript = `(function(){try{var t=localStorage.getItem('symphony-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Контакты/соцсети для шапки и футера — из админки (/admin/site).
  const settings = await getSiteSettings();
  return (
    <html
      lang="ru"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <SiteChrome settings={settings}>{children}</SiteChrome>
          <AnalyticsTracker />
        </ThemeProvider>
      </body>
    </html>
  );
}
