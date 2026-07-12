"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface Option {
  value: string;
  label: string;
  hint?: string;
}

// Кастомный выпадающий список: плавное раскрытие, аккуратные состояния,
// закрытие по клику вне и Esc. Не похож на нативный select.
export function Select({
  value,
  onChange,
  options,
  placeholder = "Выберите",
  label,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {label && <span className="mb-1.5 block text-sm text-muted">{label}</span>}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-xl border bg-surface px-4 py-3 text-left text-sm text-ink transition-colors",
          open ? "border-brass" : "border-line hover:border-brass/60"
        )}
      >
        <span className={cn(!selected && "text-muted")}>{selected ? selected.label : placeholder}</span>
        <svg
          viewBox="0 0 24 24"
          className={cn("h-4 w-4 shrink-0 text-muted transition-transform duration-300", open && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        role="listbox"
        className={cn(
          "absolute left-0 top-full z-50 mt-2 w-full origin-top overflow-hidden rounded-xl border border-line bg-surface shadow-[0_24px_50px_-24px_rgba(0,0,0,0.45)] transition-all duration-200 ease-symphony",
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
        )}
      >
        <ul className="max-h-72 overflow-y-auto p-1.5">
          {options.map((o) => {
            const active = o.value === value;
            return (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    active ? "bg-surface-2 text-ink" : "text-muted hover:bg-surface-2 hover:text-ink"
                  )}
                >
                  <span className="flex flex-col">
                    <span>{o.label}</span>
                    {o.hint && <span className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-muted">{o.hint}</span>}
                  </span>
                  {active && <span className="text-brass">✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
