import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { canAccessAdmin, canManageUsers, ROLE_LABEL, type Role } from "@/lib/roles";

const NAV = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/catalog", label: "Каталог" },
  { href: "/admin/orders", label: "Заказы" },
  { href: "/admin/leads", label: "Заявки" },
  { href: "/admin/assistant", label: "Ассистент" },
];

// Серверная защита по ролям + оболочка панели. Оборачивает контент защищённых страниц.
export async function AdminShell({
  title,
  requireUsers = false,
  children,
}: {
  title: string;
  requireUsers?: boolean;
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session?.user) redirect("/login?next=/admin");
  if (!canAccessAdmin(role)) redirect("/account"); // клиенты — в личный кабинет
  if (requireUsers && !canManageUsers(role)) redirect("/admin");

  const nav = canManageUsers(role) ? [...NAV, { href: "/admin/users", label: "Пользователи" }] : NAV;

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-surface p-6 sm:flex">
        <Link href="/" className="mb-1 font-display text-xl text-ink">Симфония</Link>
        <span className="mb-8 font-mono text-[10px] uppercase tracking-[0.25em] text-brass">
          Личный кабинет
        </span>
        <nav className="flex flex-col gap-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-line pt-5">
          <div className="text-sm text-ink">{session.user.name}</div>
          <div className="mb-1 text-xs text-muted">{session.user.email}</div>
          <div className="mb-3 inline-block rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-brass">
            {ROLE_LABEL[(role as Role) ?? "MANAGER"]}
          </div>
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 p-6 sm:p-10">
        <h1 className="mb-8 font-display text-3xl text-ink">{title}</h1>
        {children}
      </main>
    </div>
  );
}
