"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/format";
import { articleHref } from "@/lib/articles";
import {
  calcPrice,
  facadeOptions,
  layoutOptions,
  countertopOptions,
  hardwareOptions,
  openingOptions,
  appliancesOptions,
  type CalcInput,
  type Kind,
  type FacadeKey,
  type LayoutKey,
  type CountertopKey,
  type HardwareKey,
  type OpeningKey,
  type AppliancesKey,
} from "@/lib/pricing";

const AI_IMAGE_PRICE = 200; // платная ИИ-визуализация по параметрам

// Поле критерия со ссылкой «что это?» на статью с описанием опции.
function CriterionField({
  criterion,
  value,
  children,
}: {
  criterion: string;
  value: string;
  children: React.ReactNode;
}) {
  const href = articleHref(criterion, value);
  return (
    <div>
      {children}
      {href && (
        <Link
          href={href}
          className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted transition-colors hover:text-brass"
        >
          <span className="grid h-3.5 w-3.5 place-items-center rounded-full border border-current text-[8px]">?</span>
          Что это
        </Link>
      )}
    </div>
  );
}

export function Calculator({ compact = false }: { compact?: boolean }) {
  const [kind, setKind] = useState<Kind>("kitchen");
  const [size, setSize] = useState(4);
  const [facade, setFacade] = useState<FacadeKey>("mdf");
  const [layout, setLayout] = useState<LayoutKey>("corner");
  const [countertop, setCountertop] = useState<CountertopKey>("quartz");
  const [hardware, setHardware] = useState<HardwareKey>("comfort");
  const [opening, setOpening] = useState<OpeningKey>("handleless");
  const [appliances, setAppliances] = useState<AppliancesKey>("partial");
  const [lighting, setLighting] = useState(true);
  const [niche, setNiche] = useState(true);

  const input: CalcInput = { kind, size, facade, layout, countertop, hardware, opening, appliances, lighting, appliancesNiche: niche };
  const result = useMemo(() => calcPrice(input), [kind, size, facade, layout, countertop, hardware, opening, appliances, lighting, niche]);

  const isKitchen = kind === "kitchen";

  // Платная ИИ-визуализация: мини-форма контакта → оплата → страница результата.
  const [showOrder, setShowOrder] = useState(false);
  const [oName, setOName] = useState("");
  const [oPhone, setOPhone] = useState("");
  const [oEmail, setOEmail] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  async function orderVisualization(e: React.FormEvent) {
    e.preventDefault();
    setOrdering(true);
    setOrderError(null);
    try {
      const res = await fetch("/api/visualization/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: { kind, size, facade, layout, countertop, hardware, opening, appliances, lighting, appliancesNiche: niche },
          customerName: oName,
          phone: oPhone,
          email: oEmail || undefined,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.url) {
        setOrderError(d.error ?? "Не удалось оформить. Попробуйте позже.");
        setOrdering(false);
        return;
      }
      window.location.href = d.url;
    } catch {
      setOrderError("Сеть недоступна. Попробуйте позже.");
      setOrdering(false);
    }
  }

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

        <CriterionField criterion="facade" value={facade}>
          <Select label="Материал фасада" value={facade} onChange={(v) => setFacade(v as FacadeKey)} options={facadeOptions} />
        </CriterionField>

        {isKitchen && (
          <>
            <CriterionField criterion="layout" value={layout}>
              <Select label="Планировка" value={layout} onChange={(v) => setLayout(v as LayoutKey)} options={layoutOptions} />
            </CriterionField>
            <CriterionField criterion="countertop" value={countertop}>
              <Select label="Столешница" value={countertop} onChange={(v) => setCountertop(v as CountertopKey)} options={countertopOptions} />
            </CriterionField>
          </>
        )}

        <CriterionField criterion="hardware" value={hardware}>
          <Select label="Фурнитура" value={hardware} onChange={(v) => setHardware(v as HardwareKey)} options={hardwareOptions} />
        </CriterionField>

        <CriterionField criterion="opening" value={opening}>
          <Select label="Тип открывания" value={opening} onChange={(v) => setOpening(v as OpeningKey)} options={openingOptions} />
        </CriterionField>

        {isKitchen && (
          <CriterionField criterion="appliances" value={appliances}>
            <Select label="Встроенная техника" value={appliances} onChange={(v) => setAppliances(v as AppliancesKey)} options={appliancesOptions} />
          </CriterionField>
        )}

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
              <div key={b.label} className="flex items-baseline justify-between gap-4">
                <dt className="min-w-0 text-muted">{b.label}</dt>
                <dd className="shrink-0 whitespace-nowrap font-mono text-ink">{formatPrice(b.value, false)}</dd>
              </div>
            ))}
          </dl>
        )}

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Расчёт ориентировочный и бесплатный. Точная стоимость — после замера и проекта.
        </p>

        <div className="mt-auto space-y-3 pt-6">
          {!showOrder ? (
            <Button variant="outline" className="w-full" onClick={() => setShowOrder(true)}>
              Заказать визуализацию по параметрам · {formatPrice(AI_IMAGE_PRICE, false)}
            </Button>
          ) : (
            <form onSubmit={orderVisualization} className="space-y-3 rounded-xl border border-line bg-surface p-4">
              <p className="text-xs leading-relaxed text-muted">
                Фотореалистичный рендер вашей конфигурации. После оплаты {formatPrice(AI_IMAGE_PRICE, false)} —
                сразу на экране, плюс мы сохраним заявку.
              </p>
              <Input label="Имя" value={oName} onChange={(e) => setOName(e.target.value)} required />
              <Input label="Телефон" value={oPhone} onChange={(e) => setOPhone(e.target.value)} required />
              <Input label="E-mail (необязательно)" type="email" value={oEmail} onChange={(e) => setOEmail(e.target.value)} />
              {orderError && <p className="text-sm text-red-500">{orderError}</p>}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={ordering}>
                  {ordering ? "Оформляем…" : `Оплатить ${formatPrice(AI_IMAGE_PRICE, false)}`}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowOrder(false)} disabled={ordering}>
                  Отмена
                </Button>
              </div>
            </form>
          )}
          <Button className="w-full" withArrow onClick={() => (window.location.href = "/kontakty")}>
            Получить точный расчёт
          </Button>
        </div>
      </div>
    </div>
  );
}
