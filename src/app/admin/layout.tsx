import type { Metadata } from "next";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Админ-панель",
  robots: { index: false, follow: false },
};

// Защита конкретных страниц выполняется через guardAdmin() в каждой странице
// (кроме /admin/login). Здесь — только провайдер сессии.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
