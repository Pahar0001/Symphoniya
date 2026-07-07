import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { AccountSignOut } from "@/components/account/AccountSignOut";
import { canAccessAdmin, ROLE_LABEL, ROLE_DESC, type Role } from "@/lib/roles";

export const metadata: Metadata = { title: "Личный кабинет" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?next=/account");
  const role = (session.user.role as Role) ?? "CLIENT";
  const staff = canAccessAdmin(role);

  return (
    <section className="section">
      <Container className="max-w-3xl">
        <p className="eyebrow mb-4">Аккаунт</p>
        <h1 className="mb-8 font-display text-4xl text-ink">Личный кабинет</h1>

        <div className="rounded-xl border border-line bg-surface p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Имя" value={session.user.name ?? "—"} />
            <Field label="Email" value={session.user.email ?? "—"} />
            <Field label="Роль" value={`${ROLE_LABEL[role]} — ${ROLE_DESC[role]}`} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6">
            {staff && <ButtonLink href="/admin" withArrow>Панель управления</ButtonLink>}
            <ButtonLink href="/katalog" variant="outline">В каталог</ButtonLink>
            <AccountSignOut />
          </div>
        </div>

        {!staff && (
          <p className="mt-6 text-sm text-muted">
            Нужен доступ к управлению каталогом? Обратитесь к администратору —{" "}
            <Link href="/kontakty" className="text-brass hover:underline">контакты</Link>.
          </p>
        )}
      </Container>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1 text-ink">{value}</div>
    </div>
  );
}
