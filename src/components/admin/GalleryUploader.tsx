"use client";

import { useState } from "react";

// Загрузка нескольких фото проекта (галерея). Хранит массив URL,
// файлы льются в /uploads через /api/admin/upload.
export function GalleryUploader({
  value,
  onChange,
  label = "Галерея проекта (доп. фото)",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function addFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    setErr(null);
    try {
      const urls: string[] = [];
      for (const f of files) {
        const fd = new FormData();
        fd.append("file", f);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const d = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(d.error ?? "Ошибка загрузки");
        urls.push(d.url as string);
      }
      onChange([...value, ...urls]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm text-graphite-600">{label}</span>
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div key={`${url}-${i}`} className="group relative h-24 w-24 overflow-hidden rounded-md border border-wood-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              title="Удалить"
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/65 text-xs leading-none text-white hover:bg-red-600"
            >
              ×
            </button>
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button type="button" onClick={() => move(i, -1)} className="px-2 text-white disabled:opacity-30" disabled={i === 0}>
                ‹
              </button>
              <button type="button" onClick={() => move(i, 1)} className="px-2 text-white disabled:opacity-30" disabled={i === value.length - 1}>
                ›
              </button>
            </div>
          </div>
        ))}
        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-wood-300 text-center text-graphite-400 transition-colors hover:border-wood-500 hover:text-graphite-600">
          <span className="text-2xl leading-none">+</span>
          <span className="mt-1 px-1 text-[10px] leading-tight">добавить фото</span>
          <input type="file" accept="image/*" multiple onChange={addFiles} className="hidden" disabled={busy} />
        </label>
      </div>
      {busy && <p className="mt-1.5 text-xs text-graphite-500">Загрузка…</p>}
      {err && <p className="mt-1.5 text-xs text-red-600">{err}</p>}
    </div>
  );
}
