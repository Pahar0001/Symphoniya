// Форматирование, безопасное для импорта и в серверных, и в клиентских компонентах
// (в отличие от cart.ts, помеченного "use client").
export function formatPrice(value?: number | null, from = true): string {
  if (value == null) return "Цена по запросу";
  const formatted = new Intl.NumberFormat("ru-RU").format(value);
  return `${from ? "от " : ""}${formatted} ₽`;
}

// Стабильный «артикул» из id/slug — для редакционного контраста «данные vs заголовок».
export function articleFor(idOrSlug: string): string {
  let hash = 0;
  for (let i = 0; i < idOrSlug.length; i++) hash = (hash * 31 + idOrSlug.charCodeAt(i)) >>> 0;
  return "СМ-" + String(hash % 10000).padStart(4, "0");
}
