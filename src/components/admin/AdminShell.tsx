import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/admin/SignOutButton";

const NAV = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/catalog", label: "Каталог" },
  { href: "/admin/orders", label: "Заказы" },
  { href: "/admin/leads", label: "Заявки" },
];

// Серверная защита + оболочка админ-панели. Оборачивает контент защищённых страниц.
export async function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-cream-50">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-wood-100 bg-cream-100 p-6 sm:flex">
        <div className="mb-8 font-heading text-xl text-graphite-800">Симфония · админ</div>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-sm text-graphite-600 hover:bg-surface hover:text-wood-600"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6">
          <div className="mb-2 text-xs text-graphite-400">{session.user.email}</div>
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 p-6 sm:p-10">
        <h1 className="mb-8 font-heading text-3xl text-graphite-800">{title}</h1>
        {children}
      </main>
    </div>
  );
}
