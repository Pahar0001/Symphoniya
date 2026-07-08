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
  description: string | null;
}

type FormState = {
  title: string;
  image: string;
  category: string;
  city: string;
  year: string;
  material: string;
  description: string;
};

const EMPTY: FormState = {
  title: "", image: "", category: "kuhni", city: "", year: "", material: "", description: "",
};

// null — форма закрыта, "new" — создание, иначе id редактируемой работы.
type Mode = null | "new" | string;

export function AdminPortfolio({ items }: { items: Row[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(null);
  const [busy, setBusy] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function openCreate() {
    setError(null);
    setForm(EMPTY);
    setMode((m) => (m === "new" ? null : "new"));
  }

  function openEdit(it: Row) {
    setError(null);
    setForm({
      title: it.title,
      image: it.image,
      category: it.category,
      city: it.city ?? "",
      year: it.year ? String(it.year) : "",
      material: it.material ?? "",
      description: it.description ?? "",
    });
    setMode(it.id);
  }

  function closeForm() {
    setMode(null);
    setError(null);
    setForm(EMPTY);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const isEdit = mode !== "new" && mode !== null;
    const url = isEdit ? `/api/admin/portfolio/${mode}` : "/api/admin/portfolio";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
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
    closeForm();
    router.refresh();
  }

  async function togglePublish(it: Row) {
    setPublishingId(it.id);
    await fetch(`/api/admin/portfolio/${it.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !it.isPublished }),
    });
    setPublishingId(null);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Удалить работу?")) return;
    await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    if (mode === id) closeForm();
    router.refresh();
  }

  const editing = mode !== null && mode !== "new";

  return (
    <div>
      <div className="mb-6">
        <Button onClick={openCreate} variant={mode === "new" ? "outline" : "primary"}>
          {mode === "new" ? "Отмена" : "+ Добавить работу"}
        </Button>
      </div>

      {mode !== null && (
        <form onSubmit={submit} className="mb-8 grid gap-4 rounded-xl border border-line bg-surface p-6 sm:grid-cols-2">
          {editing && (
            <div className="font-mono text-xs uppercase tracking-widest text-muted sm:col-span-2">
              Редактирование работы
            </div>
          )}
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
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" disabled={busy}>
              {busy ? "Сохраняем…" : editing ? "Сохранить изменения" : "Добавить"}
            </Button>
            {editing && (
              <Button type="button" variant="outline" onClick={closeForm} disabled={busy}>
                Отмена
              </Button>
            )}
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.id}
            className={`overflow-hidden rounded-xl border bg-surface ${mode === it.id ? "border-wood-500" : "border-line"}`}
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.image} alt={it.title} className="aspect-[4/3] w-full object-cover" />
              <span
                className={`absolute left-2 top-2 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                  it.isPublished ? "bg-emerald-500/90 text-white" : "bg-graphite-700/90 text-white"
                }`}
              >
                {it.isPublished ? "Опубликовано" : "Скрыто"}
              </span>
            </div>
            <div className="p-4">
              <div className="text-ink">{it.title}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                {it.category === "kuhni" ? "Кухня" : "Корпус"}{it.city ? ` · ${it.city}` : ""}{it.year ? ` · ${it.year}` : ""}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <button onClick={() => openEdit(it)} className="text-wood-600 hover:underline">Редактировать</button>
                <button
                  onClick={() => togglePublish(it)}
                  disabled={publishingId === it.id}
                  className="text-muted hover:text-ink disabled:opacity-50"
                >
                  {publishingId === it.id ? "…" : it.isPublished ? "Снять с публикации" : "Опубликовать"}
                </button>
                <button onClick={() => remove(it.id)} className="text-red-500 hover:underline">Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
