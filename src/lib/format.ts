// Форматирование, безопасное для импорта и в серверных, и в клиентских компонентах
// (в отличие от cart.ts, помеченного "use client").
export function formatPrice(value?: number | null, from = true): string {
  if (value == null) return "Цена по запросу";
  const formatted = new Intl.NumberFormat("ru-RU").format(value);
  return `${from ? "от " : ""}${formatted} ₽`;
}
