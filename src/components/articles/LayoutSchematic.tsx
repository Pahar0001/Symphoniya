// Схематичный вид сверху планировки кухни. Тёплые токены темы.
type Kind = "line" | "corner" | "ushape" | "island";

export function LayoutSchematic({ kind }: { kind: Kind }) {
  const wall = "rgb(var(--line))";
  const counter = "rgb(var(--brass))";
  const soft = "rgb(var(--brass-soft))";
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full" role="img" aria-label="Схема планировки">
      {/* комната */}
      <rect x="6" y="6" width="188" height="128" rx="6" fill="rgb(var(--surface))" stroke={wall} strokeWidth="2" />
      {kind === "line" && <rect x="20" y="106" width="160" height="16" rx="3" fill={counter} />}
      {kind === "corner" && (
        <>
          <rect x="20" y="106" width="160" height="16" rx="3" fill={counter} />
          <rect x="20" y="30" width="16" height="92" rx="3" fill={counter} />
        </>
      )}
      {kind === "ushape" && (
        <>
          <rect x="20" y="106" width="160" height="16" rx="3" fill={counter} />
          <rect x="20" y="24" width="16" height="98" rx="3" fill={counter} />
          <rect x="164" y="24" width="16" height="98" rx="3" fill={counter} />
        </>
      )}
      {kind === "island" && (
        <>
          <rect x="20" y="20" width="160" height="16" rx="3" fill={counter} />
          <rect x="66" y="70" width="68" height="34" rx="4" fill={soft} />
        </>
      )}
    </svg>
  );
}
