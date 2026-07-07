"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select } from "@/components/ui/Select";

// Клиентские фильтры каталога: стиль, материал (значения приходят из БД).
export function Filters({ styles, materials }: { styles: string[]; materials: string[] }) {
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
    <div className="grid gap-3 sm:grid-cols-3 sm:max-w-2xl">
      <Select
        value={params.get("style") ?? ""}
        onChange={(v) => setParam("style", v)}
        placeholder="Стиль: все"
        options={[{ value: "", label: "Стиль: все" }, ...styles.map((s) => ({ value: s, label: s }))]}
      />
      <Select
        value={params.get("material") ?? ""}
        onChange={(v) => setParam("material", v)}
        placeholder="Материал: все"
        options={[{ value: "", label: "Материал: все" }, ...materials.map((m) => ({ value: m, label: m }))]}
      />
      <Select
        value={params.get("sort") ?? ""}
        onChange={(v) => setParam("sort", v)}
        placeholder="Сортировка"
        options={[
          { value: "", label: "По новизне" },
          { value: "price_asc", label: "Цена — по возрастанию" },
          { value: "price_desc", label: "Цена — по убыванию" },
        ]}
      />
    </div>
  );
}
