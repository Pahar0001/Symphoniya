"use client";

import { useState } from "react";

// Загрузка фото прямо с устройства (или вставка URL как запасной вариант).
// Два режима:
//  • контролируемый — передайте value + onChange (портфолио на React-состоянии);
//  • FormData — передайте name + defaultValue (каталог собирает форму через FormData).
export function ImageUploader({
  name,
  label = "Фото",
  value,
  defaultValue,
  onChange,
}: {
  name?: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (url: string) => void;
}) {
  const controlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue ?? "");
  const url = controlled ? (value as string) : inner;
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const setUrl = (u: string) => {
    if (!controlled) setInner(u);
    onChange?.(u);
  };

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error ?? "Ошибка загрузки");
      setUrl(d.url as string);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="block">
      <span className="mb-1.5 block text-sm text-graphite-600">{label}</span>
      <div className="flex items-start gap-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-wood-200 bg-cream-100">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-center text-[10px] leading-tight text-graphite-300">
              нет фото
            </span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={busy}
            className="block w-full cursor-pointer text-sm text-graphite-600 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-graphite-800 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-graphite-700 disabled:opacity-50"
          />
          <input
            type="text"
            name={name}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="или вставьте ссылку на изображение"
            className="w-full rounded-md border border-wood-200 bg-surface px-4 py-2.5 text-sm text-graphite-800 placeholder:text-graphite-300 focus:border-wood-400 focus:outline-none"
          />
          {busy && <p className="text-xs text-graphite-500">Загрузка…</p>}
          {err && <p className="text-xs text-red-600">{err}</p>}
        </div>
      </div>
    </div>
  );
}
