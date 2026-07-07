"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Клиентские фильтры каталога: стиль, материал (значения приходят из БД).
export function Filters({
  styles,
  materials,
}: {
  styles: string[];
  materials: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4">
      <select
        value={params.get("style") ?? ""}
        onChange={(e) => setParam("style", e.target.value)}
        className="rounded-md border border-wood-200 bg-surface px-4 py-2.5 text-sm text-graphite-700"
      >
        <option value="">Стиль: все</option>
        {styles.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={params.get("material") ?? ""}
        onChange={(e) => setParam("material", e.target.value)}
        className="rounded-md border border-wood-200 bg-surface px-4 py-2.5 text-sm text-graphite-700"
      >
        <option value="">Материал: все</option>
        {materials.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <select
        value={params.get("sort") ?? ""}
        onChange={(e) => setParam("sort", e.target.value)}
        className="rounded-md border border-wood-200 bg-surface px-4 py-2.5 text-sm text-graphite-700"
      >
        <option value="">Сортировка</option>
        <option value="price_asc">Цена ↑</option>
        <option value="price_desc">Цена ↓</option>
      </select>
    </div>
  );
}
