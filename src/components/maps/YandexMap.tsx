// Карта Яндекс. Источник:
//  - NEXT_PUBLIC_YANDEX_MAP_SRC — готовый src из конструктора карт (constructor.yandex.ru), либо
//  - NEXT_PUBLIC_YANDEX_ORG_ID — ID организации из Яндекс.Бизнеса (карточка на карте).
// Если ничего не задано — аккуратная заглушка.
export function YandexMap({ className = "" }: { className?: string }) {
  const custom = process.env.NEXT_PUBLIC_YANDEX_MAP_SRC;
  const orgId = process.env.NEXT_PUBLIC_YANDEX_ORG_ID;
  const src = custom || (orgId ? `https://yandex.ru/map-widget/v1/org/${orgId}` : null);

  if (!src) {
    return (
      <div className={`flex items-center justify-center rounded-xl border border-line bg-surface-2 text-muted ${className}`}>
        <div className="text-center">
          <div className="font-mono text-xs uppercase tracking-widest">Карта Яндекс</div>
          <div className="mt-1 text-sm">Задайте NEXT_PUBLIC_YANDEX_ORG_ID</div>
        </div>
      </div>
    );
  }

  return (
    <iframe
      title="Мы на карте Яндекс"
      src={src}
      className={`w-full rounded-xl border border-line ${className}`}
      loading="lazy"
      allowFullScreen
    />
  );
}
