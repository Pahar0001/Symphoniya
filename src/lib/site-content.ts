// ── Изменяемое наполнение сайта ───────────────────────────────
// Правьте ЭТОТ файл, чтобы поменять видеоряд/фото и подписи в первом экране (герой)
// главной страницы. Поддерживаются фото и зацикленное видео. Для видео обязательно
// задавайте poster (кадр-заставку), он показывается до загрузки ролика.
//
// Как поменять:
//  • Фото:  media: { type: "image", src: "https://…", alt: "…" }
//  • Видео: media: { type: "video", src: "https://…/loop.mp4", poster: "https://…/frame.jpg" }
// Можно указывать внешние ссылки (например, Unsplash/собственный CDN) или файлы из /public.

export type HeroMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster: string; alt?: string };

export interface HeroContent {
  media: HeroMedia;
  badge?: { label: string; value: string };
}

export const HERO: HeroContent = {
  media: {
    type: "image",
    src: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1400&q=80&auto=format&fit=crop",
    alt: "Интерьер кухни на заказ",
  },
  // Пример видео (замените src/poster на свои и type на "video"):
  // media: {
  //   type: "video",
  //   src: "/hero/kitchen-loop.mp4",
  //   poster: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1400&q=80",
  //   alt: "Кухня на заказ",
  // },
  badge: { label: "Срок изготовления", value: "4–8 недель" },
};

// Бегущая строка материалов в первом экране.
export const HERO_MARQUEE = [
  "Массив дуба",
  "Эмаль",
  "Шпон ореха",
  "Латунь",
  "Камень",
  "Стекло",
  "ЛДСП премиум",
];
