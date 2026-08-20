import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiRow, DayChart } from "@/components/admin/AnalyticsView";
import { analyticsSummary, dailySeries, topPaths } from "@/lib/analytics";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, portfolio, reviews, categories, summary, series, paths] = await Promise.all([
    prisma.product.count(),
    prisma.portfolioItem.count(),
    prisma.review.count(),
    prisma.category.count(),
    analyticsSummary(30),
    dailySeries(21),
    topPaths(30, 5),
  ]);

  const biz = [
    { label: "Товаров в каталоге", value: products, href: "/admin/catalog" },
    { label: "Проектов в портфолио", value: portfolio, href: "/admin/portfolio" },
    { label: "Отзывов", value: reviews, href: "/admin/reviews" },
    { label: "Категорий", value: categories, href: "/admin/catalog" },
  ];

  return (
    <AdminShell title="Дашборд">
      {/* Аналитика за 30 дней */}
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass">Трафик · 30 дней</h2>
        <Link href="/admin/analytics" className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-ink">
          Подробнее →
        </Link>
      </div>
      <KpiRow s={summary} />

      <div className="mt-6">
        <DayChart data={series} />
      </div>

      {/* Контент сайта */}
      <h2 className="mb-4 mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-brass">Контент</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {biz.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group rounded-xl border border-line bg-surface p-6 transition-colors hover:border-brass"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{c.label}</div>
            <div className="mt-2 font-display text-3xl text-ink transition-colors group-hover:text-brass">
              {c.value}
            </div>
          </Link>
        ))}
      </div>

      {/* Популярные страницы */}
      <div className="mt-10 rounded-xl border border-line bg-surface p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-xl text-ink">Популярные страницы</h2>
          <Link href="/admin/analytics" className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-ink">
            Вся аналитика →
          </Link>
        </div>
        {paths.length === 0 ? (
          <p className="text-sm text-muted">Данные появятся с первыми посетителями.</p>
        ) : (
          <ul className="divide-y divide-line">
            {paths.map((p) => (
              <li key={p.label} className="flex items-center justify-between gap-3 py-3">
                <span className="truncate font-mono text-sm text-ink">{p.label}</span>
                <span className="shrink-0 font-mono text-sm text-muted">{p.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
