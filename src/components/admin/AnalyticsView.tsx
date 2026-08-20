// Презентационные блоки дашборда аналитики. Чистый серверный рендер,
// без сторонних библиотек графиков — CSS-столбцы в фирменной палитре.
import type { AnalyticsSummary, DayPoint, Bar } from "@/lib/analytics";

export function KpiCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{label}</div>
      <div className="mt-2 font-display text-4xl text-ink">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </div>
  );
}

export function KpiRow({ s }: { s: AnalyticsSummary }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard label="Посетители" value={s.visitors} hint="уникальные, 30 дней" />
      <KpiCard label="Просмотры" value={s.views} hint="страниц, 30 дней" />
      <KpiCard label="Страниц/визит" value={s.pagesPerVisit} hint="глубина просмотра" />
      <KpiCard label="Клики по кнопкам" value={s.ctaClicks} hint="целевые действия, 30 дней" />
    </div>
  );
}

// Дневной график просмотров (столбцы) + линия уникальных посетителей.
export function DayChart({ data }: { data: DayPoint[] }) {
  const maxV = Math.max(1, ...data.map((d) => d.views));
  const step = data.length > 20 ? 4 : data.length > 10 ? 2 : 1;

  return (
    <div className="rounded-xl border border-line bg-surface p-6">
      <div className="mb-5 flex items-baseline justify-between">
        <h3 className="font-display text-xl text-ink">Просмотры по дням</h3>
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          макс {maxV}/день
        </span>
      </div>
      <div className="flex h-44 items-stretch gap-1.5">
        {data.map((d, i) => {
          const h = Math.round((d.views / maxV) * 100);
          const vh = Math.round((d.visitors / maxV) * 100);
          return (
            <div key={d.date} className="group relative flex flex-1 flex-col justify-end">
              {/* трек столбца во всю высоту, чтобы проценты считались корректно */}
              <div className="relative w-full flex-1">
                {/* просмотры — светлая латунь */}
                <div
                  className="absolute bottom-0 w-full rounded-t bg-brass/25 transition-colors group-hover:bg-brass/40"
                  style={{ height: `${Math.max(h, d.views > 0 ? 3 : 0)}%` }}
                />
                {/* уникальные посетители — насыщенная латунь поверх */}
                <div
                  className="absolute bottom-0 w-full rounded-t bg-brass"
                  style={{ height: `${Math.max(vh, d.visitors > 0 ? 2 : 0)}%` }}
                />
                <span className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 font-mono text-[10px] text-paper group-hover:block">
                  {d.date.slice(5)} · {d.views} просм · {d.visitors} пос
                </span>
              </div>
              <span className="mt-2 h-3 text-center font-mono text-[9px] text-muted">
                {i % step === 0 ? d.date.slice(8) : ""}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex gap-5 font-mono text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-brass" /> посетители</span>
        <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-brass/25" /> просмотры</span>
      </div>
    </div>
  );
}

// Горизонтальные бары (топ страниц / рефереры / устройства).
export function BarList({ title, items, empty = "Нет данных" }: { title: string; items: Bar[]; empty?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="rounded-xl border border-line bg-surface p-6">
      <h3 className="mb-5 font-display text-xl text-ink">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.label}>
              <div className="mb-1 flex items-baseline justify-between gap-4">
                <span className="truncate font-mono text-xs text-ink" title={it.label}>{it.label}</span>
                <span className="shrink-0 font-mono text-xs text-muted">{it.value}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-brass" style={{ width: `${(it.value / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
