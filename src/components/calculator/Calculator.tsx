"use client";

import { useMemo, useState } from "react";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import {
  calcPrice,
  facadeOptions,
  layoutOptions,
  countertopOptions,
  hardwareOptions,
  type CalcInput,
  type Kind,
  type FacadeKey,
  type LayoutKey,
  type CountertopKey,
  type HardwareKey,
} from "@/lib/pricing";

const AI_IMAGE_PRICE = 200; // будущая платная ИИ-визуализация

export function Calculator({ compact = false }: { compact?: boolean }) {
  const [kind, setKind] = useState<Kind>("kitchen");
  const [size, setSize] = useState(4);
  const [facade, setFacade] = useState<FacadeKey>("mdf");
  const [layout, setLayout] = useState<LayoutKey>("corner");
  const [countertop, setCountertop] = useState<CountertopKey>("quartz");
  const [hardware, setHardware] = useState<HardwareKey>("comfort");
  const [lighting, setLighting] = useState(true);
  const [niche, setNiche] = useState(true);

  const input: CalcInput = { kind, size, facade, layout, countertop, hardware, lighting, appliancesNiche: niche };
  const result = useMemo(() => calcPrice(input), [kind, size, facade, layout, countertop, hardware, lighting, niche]);

  const isKitchen = kind === "kitchen";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Критерии */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <div className="mb-2 flex gap-2 rounded-full border border-line bg-surface p-1">
            {(["kitchen", "cabinet"] as Kind[]).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`flex-1 rounded-full px-4 py-2 text-sm transition-colors ${
                  kind === k ? "bg-ink text-paper" : "text-muted hover:text-ink"
                }`}
              >
                {k === "kitchen" ? "Кухня" : "Корпусная мебель"}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm text-muted">
            {isKitchen ? "Длина по фасаду, пог.м" : "Площадь фасадов, кв.м"}
          </span>
          <input
            type="range"
            min={1}
            max={isKitchen ? 12 : 30}
            step={0.5}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-[color:var(--brass)]"
          />
          <div className="mt-1 font-mono text-sm text-ink">{size} {isKitchen ? "пог.м" : "кв.м"}</div>
        </label>

        <Select label="Материал фасада" value={facade} onChange={(v) => setFacade(v as FacadeKey)} options={facadeOptions} />

        {isKitchen && (
          <>
            <Select label="Планировка" value={layout} onChange={(v) => setLayout(v as LayoutKey)} options={layoutOptions} />
            <Select label="Столешница" value={countertop} onChange={(v) => setCountertop(v as CountertopKey)} options={countertopOptions} />
          </>
        )}

        <Select label="Фурнитура" value={hardware} onChange={(v) => setHardware(v as HardwareKey)} options={hardwareOptions} />

        <div className="flex flex-col justify-end gap-2 pb-1">
          <label className="flex items-center gap-2.5 text-sm text-ink">
            <input type="checkbox" checked={lighting} onChange={(e) => setLighting(e.target.checked)} className="accent-[color:var(--brass)]" />
            Светодиодная подсветка
          </label>
          {isKitchen && (
            <label className="flex items-center gap-2.5 text-sm text-ink">
              <input type="checkbox" checked={niche} onChange={(e) => setNiche(e.target.checked)} className="accent-[color:var(--brass)]" />
              Ниши под встроенную технику
            </label>
          )}
        </div>
      </div>

      {/* Результат */}
      <div className="flex flex-col rounded-xl border border-line bg-surface-2 p-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Ориентировочная стоимость</span>
        <div className="mt-1 font-display text-4xl text-ink">{formatPrice(result.total, true)}</div>

        {!compact && (
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            {result.breakdown.map((b) => (
              <div key={b.label} className="flex items-center justify-between gap-4">
                <dt className="text-muted">{b.label}</dt>
                <dd className="font-mono text-ink">{formatPrice(b.value, false)}</dd>
              </div>
            ))}
          </dl>
        )}

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Расчёт ориентировочный и бесплатный. Точная стоимость — после замера и проекта.
        </p>

        <div className="mt-auto space-y-3 pt-6">
          <Button variant="outline" className="w-full" disabled title="Скоро">
            ИИ-визуализация по вашим параметрам · {formatPrice(AI_IMAGE_PRICE, false)} — скоро
          </Button>
          <Button className="w-full" withArrow onClick={() => (window.location.href = "/kontakty")}>
            Получить точный расчёт
          </Button>
        </div>
      </div>
    </div>
  );
}
