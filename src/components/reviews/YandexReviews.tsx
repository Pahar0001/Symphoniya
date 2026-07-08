// Виджет отзывов Яндекс.Карт. Работает без API-ключа — нужен ID организации
// из Яндекс.Бизнеса (переменная NEXT_PUBLIC_YANDEX_ORG_ID).
export function YandexReviews() {
  const orgId = process.env.NEXT_PUBLIC_YANDEX_ORG_ID;
  if (!orgId) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <iframe
        title="Отзывы на Яндекс.Картах"
        src={`https://yandex.ru/maps-reviews-widget/${orgId}?comments`}
        className="h-[560px] w-full"
        loading="lazy"
      />
      <div className="border-t border-line px-4 py-3 text-center">
        <a
          href={`https://yandex.ru/maps/org/${orgId}/reviews/`}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs uppercase tracking-wider text-brass hover:underline"
        >
          Все отзывы на Яндекс.Картах →
        </a>
      </div>
    </div>
  );
}
