// Платная ИИ-визуализация по параметрам калькулятора.
// Рендеры сгенерированы через Higgsfield (модель z_image) и лежат в /public/visualizations.
// Ключ подбора — тип мебели × материал фасада (главные визуальные оси).
//
// На будущее: живая генерация «под конкретный проект» подключается в generateVisualization()
// провайдером higgsfield по ключу HIGGSFIELD_API_KEY (см. VISUALIZATION_PROVIDER).

import { z } from "zod";
import { FACADE, LAYOUT, COUNTERTOP, HARDWARE, type Kind, type FacadeKey, type LayoutKey, type CountertopKey, type HardwareKey } from "@/lib/pricing";

export const AI_IMAGE_PRICE = 200; // ₽ за визуализацию

// Параметры калькулятора, по которым строится визуализация.
export const visualizationConfigSchema = z.object({
  kind: z.enum(["kitchen", "cabinet"]),
  size: z.number().positive().max(60),
  facade: z.enum(["ldsp", "mdf", "veneer", "solid"]),
  layout: z.enum(["line", "corner", "ushape", "island"]),
  countertop: z.enum(["ldsp", "compact", "quartz", "stone"]),
  hardware: z.enum(["standard", "comfort", "premium"]),
  lighting: z.boolean(),
  appliancesNiche: z.boolean(),
});
export type VisualizationConfig = z.infer<typeof visualizationConfigSchema>;

// Готовые рендеры: тип × материал фасада.
const RENDERS: Record<Kind, Record<FacadeKey, string>> = {
  kitchen: {
    ldsp: "/visualizations/kitchen-ldsp.jpg",
    mdf: "/visualizations/kitchen-mdf.jpg",
    veneer: "/visualizations/kitchen-veneer.jpg",
    solid: "/visualizations/kitchen-solid.jpg",
  },
  cabinet: {
    ldsp: "/visualizations/cabinet-ldsp.jpg",
    mdf: "/visualizations/cabinet-mdf.jpg",
    veneer: "/visualizations/cabinet-veneer.jpg",
    solid: "/visualizations/cabinet-solid.jpg",
  },
};

// Человекочитаемое описание конфигурации (для карточки результата).
export function describeConfig(c: VisualizationConfig): string[] {
  const parts: string[] = [];
  parts.push(c.kind === "kitchen" ? "Кухня" : "Корпусная мебель");
  parts.push(`Фасады: ${FACADE[c.facade as FacadeKey].label}`);
  parts.push(
    c.kind === "kitchen"
      ? `${c.size} пог.м · ${LAYOUT[c.layout as LayoutKey].label}`
      : `${c.size} кв.м`
  );
  if (c.kind === "kitchen") parts.push(`Столешница: ${COUNTERTOP[c.countertop as CountertopKey].label}`);
  parts.push(`Фурнитура: ${HARDWARE[c.hardware as HardwareKey].label}`);
  if (c.lighting) parts.push("Светодиодная подсветка");
  if (c.kind === "kitchen" && c.appliancesNiche) parts.push("Ниши под встроенную технику");
  return parts;
}

// Текстовый промпт (описание сцены). Используется как подпись к рендеру и как
// вход для будущей живой генерации у провайдера.
export function buildPrompt(c: VisualizationConfig): string {
  const base = c.kind === "kitchen" ? "современная кухня на заказ" : "корпусная мебель на заказ";
  const bits = describeConfig(c).slice(1);
  return `Фотореалистичная визуализация: ${base}. ${bits.join(", ")}. Тёплое дневное освещение, интерьер премиум-класса.`;
}

// Курированный рендер-фолбэк по типу×фасаду (всегда доступен, без внешних вызовов).
export function curatedImage(c: VisualizationConfig): string {
  return RENDERS[c.kind as Kind][c.facade as FacadeKey];
}

export type VisualizationProvider = "curated" | "higgsfield";

// curated (по умолчанию) — подбор готового рендера по типу×фасаду.
// higgsfield — живая генерация под точные параметры (см. lib/higgsfield.ts,
// оркестрация с поллингом и фолбэком — в app/visualizaciya/[id]/page.tsx).
export function currentVisualizationProvider(): VisualizationProvider {
  return (process.env.VISUALIZATION_PROVIDER as VisualizationProvider) ?? "curated";
}
