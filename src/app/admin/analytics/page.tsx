import { AdminShell } from "@/components/admin/AdminShell";
import { KpiRow, DayChart, BarList } from "@/components/admin/AnalyticsView";
import {
  analyticsSummary,
  dailySeries,
  topPaths,
  topReferrers,
  deviceSplit,
  eventCounts,
} from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [summary, series, paths, referrers, devices, events] = await Promise.all([
    analyticsSummary(30),
    dailySeries(21),
    topPaths(30, 8),
    topReferrers(30, 6),
    deviceSplit(30),
    eventCounts(30),
  ]);

  const hasData = summary.views > 0;

  return (
    <AdminShell title="Аналитика">
      {!hasData && (
        <div className="mb-8 rounded-xl border border-brass/40 bg-surface-2 p-5 text-sm text-muted">
          Данные появятся, как только на сайт зайдут посетители. Собственная аналитика — без внешних
          сервисов и cookie-баннеров: только анонимные события (просмотры, заявки, устройства).
        </div>
      )}

      <KpiRow s={summary} />

      <div className="mt-6">
        <DayChart data={series} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <BarList title="Популярные страницы" items={paths} />
        <BarList title="События" items={events} />
        <BarList title="Источники переходов" items={referrers} empty="Пока только прямые заходы" />
        <BarList title="Устройства" items={devices} />
      </div>
    </AdminShell>
  );
}
