// Тонкие вертикальные линии сетки (12 колонок) — часть R100-эстетики.
// Ставится в relative-секцию как декоративный слой (absolute inset-0).
// Мобайл: 1 линия по центру; планшет: 3; десктоп: 11 (полная 12-колоночная сетка).
export function GridOverlay({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 z-0 ${className}`}>
      <div className="container-x relative h-full">
        {Array.from({ length: 11 }).map((_, i) => {
          const n = i + 1;
          const vis = n % 6 === 0 ? "" : n % 3 === 0 ? "hidden sm:block" : "hidden lg:block";
          return (
            <span
              key={i}
              className={`absolute bottom-0 top-0 w-px bg-line/35 ${vis}`}
              style={{ left: `${(n / 12) * 100}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}

// Редакционная строка-такт: «01 — PROJECTS — 2026» на тонкой линии.
export function MetaRow({
  index,
  label,
  right,
  className = "",
}: {
  index?: string;
  label: string;
  right?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-6 border-t border-line py-4 ${className}`}>
      {index && <span className="label shrink-0 text-ink/70">{index}</span>}
      <span className="label flex-1 text-ink/80">{label}</span>
      {right && <span className="label shrink-0">{right}</span>}
    </div>
  );
}
