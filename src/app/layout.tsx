import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-body" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: "Симфония мебели — кухни и корпусная мебель на заказ",
    template: "%s · Симфония мебели",
  },
  description:
    "Производство кухонь и корпусной мебели на заказ в Москве. Спокойный, статусный дизайн, натуральные материалы, индивидуальный расчёт.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
