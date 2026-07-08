"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

interface Row {
  id: string;
  title: string;
  image: string;
  category: string;
  city: string | null;
  year: number | null;
  material: string | null;
  isPublished: boolean;
}

export function AdminPortfolio({ items }: { items: Row[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", image: "", category: "kuhni", city: "", year: "", material: "", description: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        image: form.image,
        category: form.category,
        city: form.city,
        material: form.material,
        description: form.description,
        year: form.year ? Number(form.year) : null,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Ошибка");
      return;
    }
    setCreating(false);
    setForm({ title: "", image: "", category: "kuhni", city: "", year: "", material: "", description: "" });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Удалить работу?")) return;
    await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6">
        <Button onClick={() => setCreating((c) => !c)} variant={creating ? "outline" : "primary"}>
          {creating ? "Отмена" : "+ Добавить работу"}
        </Button>
      </div>

      {creating && (
        <form onSubmit={create} className="mb-8 grid gap-4 rounded-xl border border-line bg-surface p-6 sm:grid-cols-2">
          <Input label="Название" value={form.title} onChange={set("title")} required />
          <Input label="URL фото" value={form.image} onChange={set("image")} required />
          <Select label="Категория" value={form.category} onChange={(v) => setForm({ ...form, category: v })}
            options={[{ value: "kuhni", label: "Кухни" }, { value: "korpusnaya-mebel", label: "Корпусная мебель" }]} />
          <Input label="Город" value={form.city} onChange={set("city")} />
          <Input label="Год" type="number" value={form.year} onChange={set("year")} />
          <Input label="Материал" value={form.material} onChange={set("material")} />
          <div className="sm:col-span-2">
            <Textarea label="Описание" value={form.description} onChange={set("description")} />
          </div>
          {error && <p className="text-sm text-red-500 sm:col-span-2">{error}</p>}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={busy}>{busy ? "Сохраняем…" : "Добавить"}</Button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div key={it.id} className="overflow-hidden rounded-xl border border-line bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.image} alt={it.title} className="aspect-[4/3] w-full object-cover" />
            <div className="p-4">
              <div className="text-ink">{it.title}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                {it.category === "kuhni" ? "Кухня" : "Корпус"}{it.city ? ` · ${it.city}` : ""}{it.year ? ` · ${it.year}` : ""}
              </div>
              <button onClick={() => remove(it.id)} className="mt-3 text-sm text-red-500 hover:underline">Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
