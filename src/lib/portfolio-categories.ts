// Ветки мебели (портфолио + навигация + коллекция + админка).
export type CatSlug = "kuhni" | "shkafy" | "garderobnye" | "sanuzly";

export const PORTFOLIO_CATEGORIES: {
  slug: CatSlug;
  label: string;
  desc: string;
  cover: string;
}[] = [
  { slug: "kuhni", label: "Кухни", desc: "Индивидуальные проекты под ваше пространство", cover: "/uploads/p6-1.jpg" },
  { slug: "shkafy", label: "Шкафы", desc: "Распашные и купе — под любую нишу", cover: "/uploads/p5-1.jpg" },
  { slug: "garderobnye", label: "Гардеробные", desc: "Системы хранения под потолок", cover: "/uploads/p2-1.jpg" },
  { slug: "sanuzly", label: "Сан-узлы", desc: "Влагостойкая мебель для ванной комнаты", cover: "/uploads/cat-sanuzly.jpg" },
];

// ЖК — ОТДЕЛЬНАЯ категория комплексных проектов (вся квартира/объект: кухня +
// гардеробная + спальня + санузел + прихожая), а не ветка мебели и не фильтр
// внутри веток. Живёт рядом с ветками как самостоятельная плашка.
export const ZHK_SLUG = "zhk";
export const ZHK_LABEL = "ЖК";

// Категории для фильтра проектов: ветки мебели + отдельная плашка «ЖК».
export const FILTER_CATEGORIES: { slug: string; label: string }[] = [
  ...PORTFOLIO_CATEGORIES.map((c) => ({ slug: c.slug as string, label: c.label })),
  { slug: ZHK_SLUG, label: ZHK_LABEL },
];

export const CAT_LABEL: Record<string, string> = {
  ...Object.fromEntries(PORTFOLIO_CATEGORIES.map((c) => [c.slug, c.label])),
  [ZHK_SLUG]: ZHK_LABEL,
};

export function catLabel(slug: string): string {
  return CAT_LABEL[slug] ?? slug;
}

export function isValidCategory(slug?: string | null): boolean {
  return !!slug && FILTER_CATEGORIES.some((c) => c.slug === slug);
}
