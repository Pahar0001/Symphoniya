"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Category } from "@prisma/client";
import type { ProductWithImages } from "@/types";

type ProductRow = ProductWithImages & { category: Category };

// CRUD товаров без доступа к БД напрямую — решает проблему «потерянного» админа старого сайта.
export function AdminCatalog({
  products,
  categories,
}: {
  products: ProductRow[];
  categories: Category[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(form: FormData, id?: string) {
    setBusy(true);
    setError(null);
    const priceRaw = String(form.get("price") ?? "").trim();
    const payload = {
      slug: String(form.get("slug") ?? ""),
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? ""),
      price: priceRaw ? Number(priceRaw) : null,
      style: String(form.get("style") ?? "") || null,
      material: String(form.get("material") ?? "") || null,
      categoryId: String(form.get("categoryId") ?? ""),
      isPromo: form.get("isPromo") === "on",
      isPublished: form.get("isPublished") === "on",
      images: String(form.get("image") ?? "").trim()
        ? [{ url: String(form.get("image")), alt: String(form.get("title") ?? "") }]
        : undefined,
    };
    const res = await fetch(id ? `/api/admin/products/${id}` : "/api/admin/products", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Ошибка сохранения");
      return;
    }
    setEditing(null);
    setCreating(false);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Удалить товар?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const showForm = creating || editing;

  return (
    <div>
      <div className="mb-6">
        <Button onClick={() => { setCreating(true); setEditing(null); }}>+ Новый товар</Button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save(new FormData(e.currentTarget), editing?.id);
          }}
          className="mb-8 grid gap-4 rounded-lg border border-wood-200 bg-white p-6 sm:grid-cols-2"
        >
          <Input name="title" label="Название" defaultValue={editing?.title} required />
          <Input name="slug" label="Slug (латиница)" defaultValue={editing?.slug} required />
          <label className="block">
            <span className="mb-1.5 block text-sm text-graphite-600">Категория</span>
            <select
              name="categoryId"
              defaultValue={editing?.categoryId ?? categories[0]?.id}
              className="w-full rounded-md border border-wood-200 px-4 py-3"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </label>
          <Input name="price" label="Цена, ₽ (пусто = по запросу)" type="number" defaultValue={editing?.price ?? ""} />
          <Input name="style" label="Стиль" defaultValue={editing?.style ?? ""} />
          <Input name="material" label="Материал" defaultValue={editing?.material ?? ""} />
          <Input name="image" label="URL изображения" defaultValue={editing?.images[0]?.url ?? ""} />
          <div className="sm:col-span-2">
            <Textarea name="description" label="Описание" defaultValue={editing?.description} required />
          </div>
          <label className="flex items-center gap-2 text-sm text-graphite-600">
            <input type="checkbox" name="isPromo" defaultChecked={editing?.isPromo} /> Акция
          </label>
          <label className="flex items-center gap-2 text-sm text-graphite-600">
            <input type="checkbox" name="isPublished" defaultChecked={editing?.isPublished ?? true} /> Опубликован
          </label>
          {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" disabled={busy}>{busy ? "Сохраняем…" : "Сохранить"}</Button>
            <Button type="button" variant="ghost" onClick={() => { setEditing(null); setCreating(false); }}>
              Отмена
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border border-wood-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-left text-graphite-500">
            <tr>
              <th className="p-3">Название</th>
              <th className="p-3">Категория</th>
              <th className="p-3">Цена</th>
              <th className="p-3">Статус</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-wood-100">
                <td className="p-3 text-graphite-800">{p.title}</td>
                <td className="p-3 text-graphite-500">{p.category.title}</td>
                <td className="p-3">{p.price ? `${p.price} ₽` : "по запросу"}</td>
                <td className="p-3">{p.isPublished ? "опубликован" : "скрыт"}</td>
                <td className="p-3 text-right">
                  <button onClick={() => { setEditing(p); setCreating(false); }} className="mr-3 text-wood-600 hover:underline">
                    Изменить
                  </button>
                  <button onClick={() => remove(p.id)} className="text-red-500 hover:underline">
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
