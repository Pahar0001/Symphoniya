"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

export interface StageMaterial {
  slug: string;
  name: string;
  tagline: string;
  tint: string;
  pricePerUnit: number;
  lifespan: string;
  strengths: string[];
}

// Своё «настроение» у каждого материала — подпись стиля над названием.
const STYLE_LABEL: Record<string, string> = {
  ldsp: "Практичный минимализм",
  mdf: "Тёплая матовая эмаль",
  veneer: "Природный шпон",
  solid: "Благородный массив",
};

export function FasadyStage({ materials }: { materials: StageMaterial[] }) {
  const [active, setActive] = useState(0);
  const m = materials[active];
  const styleLabel = STYLE_LABEL[m.slug] ?? "Материал фасада";

  return (
    <div
      className="facade-stage relative overflow-hidden rounded-2xl border border-line"
      style={{ backgroundColor: "var(--surface)" }}
    >
      {/* Анимированный фон — цвет под выбранный материал */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0" style={{ background: m.tint, opacity: 0.14, transition: "background 0.8s ease" }} />
        <div
          className="facade-blob absolute -left-24 -top-24 h-80 w-80 rounded-full"
          style={{ background: m.tint, opacity: 0.55, animation: "floatSlow 9s ease-in-out infinite" }}
        />
        <div
          className="facade-blob absolute -bottom-28 -right-16 h-96 w-96 rounded-full"
          style={{ background: m.tint, opacity: 0.4, animation: "floatSlow2 12s ease-in-out infinite" }}
        />
        <div className="facade-sheen absolute inset-y-0 left-0 w-1/3 bg-white/10" />
      </div>

      <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        {/* Контент активного материала */}
        <div key={m.slug} className="facade-fade rounded-xl bg-surface/70 p-6 backdrop-blur-md sm:p-8">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-brass">{styleLabel}</div>
          <h2 className="mt-2 font-display text-4xl text-ink sm:text-5xl">{m.name}</h2>
          <p className="mt-3 text-lg leading-relaxed text-muted">{m.tagline}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-ink">
              {formatPrice(m.pricePerUnit, true)}
            </span>
            <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
              Служит {m.lifespan}
            </span>
          </div>

          <ul className="mt-5 space-y-2">
            {m.strengths.slice(0, 3).map((s) => (
              <li key={s} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                <span className="mt-0.5 text-brass">✳</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/fasady/${m.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-paper transition-transform hover:-translate-y-0.5"
            >
              Подробно о материале →
            </Link>
            <Link
              href="/raschet"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm text-ink transition-colors hover:border-brass"
            >
              Рассчитать
            </Link>
          </div>
        </div>

        {/* Крупный образец фактуры */}
        <div
          key={`swatch-${m.slug}`}
          className="facade-fade relative hidden aspect-[4/5] overflow-hidden rounded-xl border border-line lg:block"
          style={{ background: `linear-gradient(150deg, ${m.tint}, ${m.tint}aa 55%, ${m.tint}55)` }}
        >
          <div className="facade-sheen absolute inset-y-0 left-0 w-1/2 bg-white/15" />
          <div className="absolute bottom-4 left-4 rounded-lg bg-black/45 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white backdrop-blur">
            Образец · {m.name}
          </div>
        </div>
      </div>

      {/* Переключатель материалов */}
      <div className="relative flex flex-wrap gap-2 border-t border-line bg-surface/60 p-4 backdrop-blur-md">
        {materials.map((mat, i) => (
          <button
            key={mat.slug}
            onClick={() => setActive(i)}
            className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm transition-all ${
              i === active
                ? "border-brass bg-surface text-ink shadow-sm"
                : "border-line text-muted hover:border-brass/60 hover:text-ink"
            }`}
            aria-pressed={i === active}
          >
            <span className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ background: mat.tint }} />
            {mat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
