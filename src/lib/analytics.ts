// ── Собственная аналитика ──────────────────────────────────────────
// Никаких внешних сервисов и cookie-баннеров: события анонимны, без PII.
// Сбор — через /api/analytics/track, чтение — на /admin/analytics.
import "server-only";
import { prisma } from "@/lib/db";

export type EventType =
  | "page_view"
  | "product_view"
  | "project_view"
  | "cta_click"
  | "scroll"
  | "horizontal_enter"
  | "visualization";

// Грубое, но достаточное определение устройства по User-Agent.
export function deviceFromUA(ua: string | null | undefined): "mobile" | "tablet" | "desktop" {
  const s = (ua ?? "").toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|iemobile|opera mini/.test(s)) return "mobile";
  return "desktop";
}

// Реферер → чистый домен (пустой для прямых заходов и своего же домена).
export function refHost(referrer: string | null | undefined, selfHost?: string): string | null {
  if (!referrer) return null;
  try {
    const h = new URL(referrer).hostname.replace(/^www\./, "");
    if (!h) return null;
    if (selfHost && h === selfHost.replace(/^www\./, "")) return null;
    return h;
  } catch {
    return null;
  }
}

export async function recordEvent(e: {
  type: EventType;
  path?: string;
  referrer?: string | null;
  device?: string | null;
  session?: string | null;
  meta?: Record<string, unknown> | null;
}) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        type: e.type,
        path: (e.path ?? "/").slice(0, 512),
        referrer: e.referrer ? e.referrer.slice(0, 255) : null,
        device: e.device ?? null,
        session: e.session ?? null,
        meta: (e.meta ?? undefined) as object | undefined,
      },
    });
  } catch (err) {
    // Аналитика не должна ронять пользовательские сценарии.
    console.error("analytics recordEvent error:", err);
  }
}

// ── Чтение для дашборда ─────────────────────────────────────────────
const since = (days: number) => new Date(Date.now() - days * 864e5);

export interface AnalyticsSummary {
  views: number;
  visitors: number;
  ctaClicks: number;
  pagesPerVisit: number; // просмотров на уникального посетителя
}

export async function analyticsSummary(days = 30): Promise<AnalyticsSummary> {
  const from = since(days);
  const [views, ctaClicks, sessions] = await Promise.all([
    prisma.analyticsEvent.count({ where: { type: "page_view", createdAt: { gte: from } } }),
    prisma.analyticsEvent.count({ where: { type: "cta_click", createdAt: { gte: from } } }),
    prisma.analyticsEvent.findMany({
      where: { type: "page_view", createdAt: { gte: from }, session: { not: null } },
      distinct: ["session"],
      select: { session: true },
    }),
  ]);
  const visitors = sessions.length;
  const pagesPerVisit = visitors > 0 ? Math.round((views / visitors) * 10) / 10 : 0;
  return { views, visitors, ctaClicks, pagesPerVisit };
}

export interface DayPoint {
  date: string; // YYYY-MM-DD
  views: number;
  visitors: number;
}

// Дневной ряд просмотров и уникальных сессий за N дней (включая пустые дни).
export async function dailySeries(days = 14): Promise<DayPoint[]> {
  const from = since(days);
  const rows = await prisma.$queryRaw<{ day: Date; views: bigint; visitors: bigint }[]>`
    SELECT date_trunc('day', "createdAt") AS day,
           count(*) AS views,
           count(DISTINCT "session") AS visitors
    FROM "AnalyticsEvent"
    WHERE type = 'page_view' AND "createdAt" >= ${from}
    GROUP BY 1
    ORDER BY 1 ASC;
  `;
  const map = new Map<string, { views: number; visitors: number }>();
  for (const r of rows) {
    const key = new Date(r.day).toISOString().slice(0, 10);
    map.set(key, { views: Number(r.views), visitors: Number(r.visitors) });
  }
  const out: DayPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
    const v = map.get(d);
    out.push({ date: d, views: v?.views ?? 0, visitors: v?.visitors ?? 0 });
  }
  return out;
}

export interface Bar {
  label: string;
  value: number;
}

export async function topPaths(days = 30, limit = 8): Promise<Bar[]> {
  const from = since(days);
  const groups = await prisma.analyticsEvent.groupBy({
    by: ["path"],
    where: { type: "page_view", createdAt: { gte: from } },
    _count: { path: true },
    orderBy: { _count: { path: "desc" } },
    take: limit,
  });
  return groups.map((g) => ({ label: g.path, value: g._count.path }));
}

export async function topReferrers(days = 30, limit = 6): Promise<Bar[]> {
  const from = since(days);
  const groups = await prisma.analyticsEvent.groupBy({
    by: ["referrer"],
    where: { type: "page_view", createdAt: { gte: from }, referrer: { not: null } },
    _count: { referrer: true },
    orderBy: { _count: { referrer: "desc" } },
    take: limit,
  });
  return groups.map((g) => ({ label: g.referrer ?? "—", value: g._count.referrer }));
}

// Разбивка по типам событий (page_view, scroll, project_view, cta_click, …).
export async function eventCounts(days = 30): Promise<Bar[]> {
  const from = since(days);
  const groups = await prisma.analyticsEvent.groupBy({
    by: ["type"],
    where: { createdAt: { gte: from } },
    _count: { type: true },
    orderBy: { _count: { type: "desc" } },
  });
  const label: Record<string, string> = {
    page_view: "Просмотры страниц",
    scroll: "Глубина прокрутки",
    project_view: "Просмотры проектов",
    cta_click: "Клики по кнопкам",
    horizontal_enter: "Вход в галерею",
    product_view: "Просмотры товаров",
    visualization: "Визуализации",
  };
  return groups.map((g) => ({ label: label[g.type] ?? g.type, value: g._count.type }));
}

export async function deviceSplit(days = 30): Promise<Bar[]> {
  const from = since(days);
  const groups = await prisma.analyticsEvent.groupBy({
    by: ["device"],
    where: { type: "page_view", createdAt: { gte: from } },
    _count: { device: true },
  });
  const label: Record<string, string> = { mobile: "Мобильные", tablet: "Планшеты", desktop: "Десктоп" };
  return groups
    .map((g) => ({ label: label[g.device ?? ""] ?? "Прочее", value: g._count.device }))
    .sort((a, b) => b.value - a.value);
}
