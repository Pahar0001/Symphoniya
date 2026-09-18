// ─── Настройки сайта: значения ПО УМОЛЧАНИЮ ───────────────────────────
// Эти значения редактируются из админки (/admin/site) и хранятся в БД
// (модель SiteSetting, см. lib/site-settings.ts). Здесь — только стартовые
// значения: они показываются, пока в админке ничего не сохранено, и служат
// запасным вариантом, если БД недоступна. Файл безопасен для клиентских компонентов.

export interface Salon {
  title: string; // подпись салона («Салон на Тимирязевской»)
  address: string; // полный адрес
  phone: string; // телефон в человекочитаемом виде
  mapUrl?: string; // своя ссылка на карту; пусто → строится автоматически
  lat?: number | null; // координаты — для встроенной карты на «Контактах»
  lon?: number | null;
}

export interface SiteSettings {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: string;
    imageAlt: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  hours: string;
  salons: Salon[];
  socials: { max: string; vk: string };
  footerAbout: string;
  homeCtaTitle: string;
  projectCtaTitle: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  hero: {
    eyebrow: "Мебель · Архитектура · Москва и область",
    title: "Мебель на заказ в Москве и области",
    subtitle:
      "Кухни, шкафы, гардеробные и сан-узлы — спроектированные как архитектура, под ваше пространство и сценарий жизни.",
    // Фото 16:9 (напр. 2560×1440). /hero.jpg лежит в корне public и запечён в образ;
    // фото, загруженное из админки, попадает в /uploads (серверное хранилище).
    image: "/hero.jpg",
    imageAlt: "Интерьер с мебелью на заказ от «Симфонии мебели»",
    primaryLabel: "Рассчитать проект",
    primaryHref: "/kontakty",
    secondaryLabel: "Смотреть проекты",
    secondaryHref: "#projects",
  },
  hours: "Ежедневно 10:00–21:00",
  salons: [
    {
      title: "Салон на Тимирязевской",
      address: "Москва, Тимирязевская ул., 2/3",
      phone: "+7 (995) 116 72 86",
      lat: 55.8079,
      lon: 37.5733,
    },
    {
      title: "Салон на Ленинградском шоссе",
      address: "Москва, Ленинградское шоссе, 25",
      phone: "+7 (995) 797 40 99",
      lat: 55.82788,
      lon: 37.48942,
    },
  ],
  // Ссылки на соцсети — заполняются в админке. Пока пусто, иконка не кликабельна.
  socials: { max: "", vk: "" },
  footerAbout: "Мебель на заказ: кухни, шкафы, гардеробные и сан-узлы. Москва и область.",
  homeCtaTitle: "Готовы обсудить ваш проект?",
  projectCtaTitle: "Понравился проект?",
};

// tel:-ссылка из телефона в любом формате: «+7 (995) 116 72 86» → «tel:+79951167286».
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `tel:+${digits.startsWith("8") && digits.length === 11 ? `7${digits.slice(1)}` : digits}`;
}

// Ссылка на Яндекс.Карты для салона: своя (mapUrl) либо по адресу/координатам.
export function salonMapUrl(s: Salon): string {
  if (s.mapUrl) return s.mapUrl;
  const text = encodeURIComponent(s.address);
  if (typeof s.lat === "number" && typeof s.lon === "number") {
    return `https://yandex.ru/maps/?ll=${s.lon}%2C${s.lat}&z=17&text=${text}`;
  }
  return `https://yandex.ru/maps/?text=${text}`;
}

// Короткий адрес для узкой верхней полосы шапки: без «Москва, ».
export function shortAddress(address: string): string {
  return address.replace(/^\s*(г\.\s*)?Москва,\s*/i, "");
}
