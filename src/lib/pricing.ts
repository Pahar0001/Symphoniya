// Расчёт персональной стоимости — прозрачная модель на коэффициентах.
// Бесплатно и доступно всем. Значения — ориентировочные, финальная цена по проекту.

export type Kind = "kitchen" | "cabinet";

export interface Option {
  value: string;
  label: string;
  hint?: string;
}

// ── Базовая цена материала фасада за единицу (кухня — за пог.м, корпус — за кв.м) ──
export const FACADE = {
  ldsp: { label: "ЛДСП", price: 22000 },
  mdf: { label: "МДФ, эмаль (матовая)", price: 34000 },
  veneer: { label: "Шпон ореха/дуба", price: 46000 },
  solid: { label: "Массив дуба", price: 62000 },
} as const;
export type FacadeKey = keyof typeof FACADE;

// ── Планировка кухни (множитель на объём/сложность) ──
export const LAYOUT = {
  line: { label: "Прямая", factor: 1.0 },
  corner: { label: "Угловая", factor: 1.15 },
  ushape: { label: "П-образная", factor: 1.3 },
  island: { label: "С островом", factor: 1.5 },
} as const;
export type LayoutKey = keyof typeof LAYOUT;

// ── Столешница (надбавка за единицу) ──
export const COUNTERTOP = {
  ldsp: { label: "ЛДСП / постформинг", price: 3000 },
  compact: { label: "Компакт-плита", price: 7000 },
  quartz: { label: "Кварцевый агломерат", price: 14000 },
  stone: { label: "Натуральный камень", price: 20000 },
} as const;
export type CountertopKey = keyof typeof COUNTERTOP;

// ── Фурнитура (множитель) ──
export const HARDWARE = {
  standard: { label: "Стандарт", factor: 1.0 },
  comfort: { label: "Комфорт (доводчики Blum)", factor: 1.12 },
  premium: { label: "Премиум (сервоприводы)", factor: 1.25 },
} as const;
export type HardwareKey = keyof typeof HARDWARE;

// ── Тип открывания фасадов (множитель) ──
export const OPENING = {
  handles: { label: "На ручки", factor: 1.0 },
  handleless: { label: "Без ручек (нажимные)", factor: 1.06 },
  gola: { label: "Профиль Gola", factor: 1.08 },
} as const;
export type OpeningKey = keyof typeof OPENING;

// ── Комплектация встроенной техникой (надбавка, кухня) ──
export const APPLIANCES = {
  none: { label: "Без встроенной техники", price: 0 },
  partial: { label: "Базовый комплект", price: 60000 },
  full: { label: "Полный комплект", price: 160000 },
} as const;
export type AppliancesKey = keyof typeof APPLIANCES;

export interface CalcInput {
  kind: Kind;
  size: number; // пог.м (кухня) или кв.м (корпус)
  facade: FacadeKey;
  layout: LayoutKey; // используется для кухни
  countertop: CountertopKey; // используется для кухни
  hardware: HardwareKey;
  opening: OpeningKey; // тип открывания фасадов
  appliances: AppliancesKey; // комплектация встроенной техникой (кухня)
  lighting: boolean; // подсветка
  appliancesNiche: boolean; // ниши под встроенную технику (кухня)
}

export interface CalcResult {
  total: number; // ориентир «от»
  breakdown: { label: string; value: number }[];
}

export function calcPrice(input: CalcInput): CalcResult {
  const size = Math.max(1, Math.min(input.size || 0, 60));
  const facade = FACADE[input.facade].price;
  const hardwareFactor = HARDWARE[input.hardware].factor;
  const breakdown: { label: string; value: number }[] = [];

  const layoutFactor = input.kind === "kitchen" ? LAYOUT[input.layout].factor : 1.05;

  const base = Math.round(facade * size * layoutFactor);
  breakdown.push({ label: `Фасады · ${input.kind === "kitchen" ? "пог.м" : "кв.м"} × ${size}`, value: base });

  let extras = 0;
  if (input.kind === "kitchen") {
    const ct = Math.round(COUNTERTOP[input.countertop].price * size);
    extras += ct;
    breakdown.push({ label: "Столешница", value: ct });
    if (input.appliancesNiche) {
      const v = 28000;
      extras += v;
      breakdown.push({ label: "Ниши под встроенную технику", value: v });
    }
    const appl = APPLIANCES[input.appliances].price;
    if (appl > 0) {
      extras += appl;
      breakdown.push({ label: `Встроенная техника · ${APPLIANCES[input.appliances].label}`, value: appl });
    }
  }
  if (input.lighting) {
    const v = Math.round(4500 * size);
    extras += v;
    breakdown.push({ label: "Светодиодная подсветка", value: v });
  }

  // Фурнитура и тип открывания — множители на весь объём.
  const openingFactor = OPENING[input.opening].factor;
  const beforeMul = base + extras;
  const withMul = Math.round(beforeMul * hardwareFactor * openingFactor);
  const hardwareAdd = Math.round(beforeMul * hardwareFactor) - beforeMul;
  if (hardwareAdd > 0) breakdown.push({ label: `Фурнитура · ${HARDWARE[input.hardware].label}`, value: hardwareAdd });
  const openingAdd = withMul - Math.round(beforeMul * hardwareFactor);
  if (openingAdd > 0) breakdown.push({ label: `Открывание · ${OPENING[input.opening].label}`, value: openingAdd });

  return { total: withMul, breakdown };
}

export const facadeOptions: Option[] = (Object.keys(FACADE) as FacadeKey[]).map((k) => ({ value: k, label: FACADE[k].label }));
export const layoutOptions: Option[] = (Object.keys(LAYOUT) as LayoutKey[]).map((k) => ({ value: k, label: LAYOUT[k].label }));
export const countertopOptions: Option[] = (Object.keys(COUNTERTOP) as CountertopKey[]).map((k) => ({ value: k, label: COUNTERTOP[k].label }));
export const hardwareOptions: Option[] = (Object.keys(HARDWARE) as HardwareKey[]).map((k) => ({ value: k, label: HARDWARE[k].label, hint: `×${HARDWARE[k].factor}` }));
export const openingOptions: Option[] = (Object.keys(OPENING) as OpeningKey[]).map((k) => ({ value: k, label: OPENING[k].label }));
export const appliancesOptions: Option[] = (Object.keys(APPLIANCES) as AppliancesKey[]).map((k) => ({ value: k, label: APPLIANCES[k].label }));
