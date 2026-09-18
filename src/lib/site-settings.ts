import { unstable_cache } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/site-config";

// Серверная часть настроек сайта: чтение из БД (с кешем) и схема валидации.
// Значения по умолчанию и типы — в lib/site-config.ts (клиент-безопасный файл).

export const SETTINGS_KEY = "site";
export const SETTINGS_TAG = "site-settings";

const phoneRegex = /^[\d\s()+-]{7,20}$/;
// Ссылка: внутренняя (/kontakty, #projects) или https://…
const href = z.string().trim().max(300).regex(/^(\/|#|https?:\/\/)/, "Ссылка должна начинаться с /, # или https://");
const optionalUrl = z.string().trim().max(300).regex(/^https?:\/\//, "Ссылка должна начинаться с https://").or(z.literal(""));
const coord = z.number().min(-180).max(180).nullable().optional();

export const siteSettingsSchema = z.object({
  hero: z.object({
    eyebrow: z.string().trim().max(120),
    title: z.string().trim().min(2, "Укажите заголовок").max(120),
    subtitle: z.string().trim().max(300),
    image: z.string().trim().min(4, "Укажите фото").max(500),
    imageAlt: z.string().trim().max(200),
    primaryLabel: z.string().trim().min(1).max(40),
    primaryHref: href,
    secondaryLabel: z.string().trim().max(40),
    secondaryHref: href.or(z.literal("")),
  }),
  hours: z.string().trim().max(80),
  salons: z
    .array(
      z.object({
        title: z.string().trim().max(80),
        address: z.string().trim().min(4, "Укажите адрес").max(160),
        phone: z.string().trim().regex(phoneRegex, "Некорректный телефон"),
        mapUrl: optionalUrl.optional(),
        lat: coord,
        lon: coord,
      })
    )
    .min(1, "Нужен хотя бы один салон")
    .max(6),
  socials: z.object({ max: optionalUrl, vk: optionalUrl }),
  footerAbout: z.string().trim().max(300),
  homeCtaTitle: z.string().trim().min(2).max(120),
  projectCtaTitle: z.string().trim().min(2).max(120),
});

// Накладываем сохранённое поверх умолчаний: новые поля, добавленные в код позже,
// получают значение по умолчанию, даже если в БД лежит старая версия настроек.
function merge(saved: unknown): SiteSettings {
  if (!saved || typeof saved !== "object") return DEFAULT_SETTINGS;
  const v = saved as Partial<SiteSettings>;
  return {
    ...DEFAULT_SETTINGS,
    ...v,
    hero: { ...DEFAULT_SETTINGS.hero, ...(v.hero ?? {}) },
    socials: { ...DEFAULT_SETTINGS.socials, ...(v.socials ?? {}) },
    salons: Array.isArray(v.salons) && v.salons.length > 0 ? v.salons : DEFAULT_SETTINGS.salons,
  };
}

const readCached = unstable_cache(
  async () => {
    const row = await prisma.siteSetting.findUnique({ where: { key: SETTINGS_KEY } });
    return row?.value ?? null;
  },
  [SETTINGS_TAG],
  // Тег сбрасывается при сохранении в админке; revalidate — страховка для страниц,
  // собранных без БД (на этапе сборки образа берутся значения по умолчанию).
  { tags: [SETTINGS_TAG], revalidate: 60 }
);

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return merge(await readCached());
  } catch {
    // БД недоступна (сборка образа, сбой) — сайт всё равно рендерится на умолчаниях.
    return DEFAULT_SETTINGS;
  }
}
