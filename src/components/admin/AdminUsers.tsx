"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { ROLE_LABEL, ROLE_DESC, type Role } from "@/lib/roles";

interface Row {
  id: string;
  name: string | null;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
}

export function AdminUsers({
  users,
  assignable,
  myId,
}: {
  users: Row[];
  assignable: Role[];
  myId: string;
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: assignable[0] ?? "CLIENT" });

  const roleOptions = assignable.map((r) => ({ value: r, label: ROLE_LABEL[r], hint: ROLE_DESC[r] }));

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Ошибка");
      return;
    }
    setCreating(false);
    setForm({ name: "", email: "", phone: "", password: "", role: assignable[0] ?? "CLIENT" });
    router.refresh();
  }

  async function changeRole(id: string, role: string) {
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Удалить пользователя?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error ?? "Не удалось удалить");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6">
        <Button onClick={() => setCreating((c) => !c)} variant={creating ? "outline" : "primary"}>
          {creating ? "Отмена" : "+ Добавить пользователя"}
        </Button>
      </div>

      {creating && (
        <form onSubmit={create} className="mb-8 grid gap-4 rounded-xl border border-line bg-surface p-6 sm:grid-cols-2">
          <Input label="Имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Пароль" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Select label="Роль" value={form.role} onChange={(v) => setForm({ ...form, role: v as Role })} options={roleOptions} />
          {error && <p className="text-sm text-red-500 sm:col-span-2">{error}</p>}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={busy}>{busy ? "Создаём…" : "Создать"}</Button>
          </div>
        </form>
      )}

      <div className="overflow-visible rounded-xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-line text-left font-mono text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="p-4">Пользователь</th>
              <th className="p-4">Контакты</th>
              <th className="p-4 w-52">Роль</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-line align-top">
                <td className="p-4">
                  <div className="text-ink">{u.name ?? "—"}</div>
                  <div className="text-xs text-muted">{u.email}</div>
                </td>
                <td className="p-4 text-muted">{u.phone ?? "—"}</td>
                <td className="p-4">
                  {assignable.length > 0 && u.id !== myId ? (
                    <Select
                      value={u.role}
                      onChange={(v) => changeRole(u.id, v)}
                      options={roleOptions.length ? roleOptions : [{ value: u.role, label: ROLE_LABEL[u.role as Role] ?? u.role }]}
                    />
                  ) : (
                    <span className="inline-block rounded-full bg-surface-2 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-brass">
                      {ROLE_LABEL[u.role as Role] ?? u.role}
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {u.id !== myId && (
                    <button onClick={() => remove(u.id)} className="text-red-500 transition-colors hover:text-red-600">
                      Удалить
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
