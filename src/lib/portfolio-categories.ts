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

export const CAT_LABEL: Record<string, string> = Object.fromEntries(
  PORTFOLIO_CATEGORIES.map((c) => [c.slug, c.label])
);

export function catLabel(slug: string): string {
  return CAT_LABEL[slug] ?? slug;
}
