// Бесплатная карта на OpenStreetMap (iframe-эмбед). Не требует ключей/регистрации,
// работает в РФ. Координаты и адрес салона приходят из настроек сайта (/admin/site).
// Для ОСНОВНОГО салона src можно переопределить готовой Яндекс-картой через
// NEXT_PUBLIC_YANDEX_MAP_SRC (например, когда появится карточка в Яндекс.Бизнесе).

// bbox для эмбеда OSM (небольшая область вокруг точки).
const D_LON = 0.008;
const D_LAT = 0.004;
const r = (n: number) => n.toFixed(6);

export function LocationMap({
  lat,
  lon,
  address,
  srcOverride,
  className = "",
}: {
  lat: number;
  lon: number;
  address: string;
  srcOverride?: string;
  className?: string;
}) {
  const bbox = [r(lon - D_LON), r(lat - D_LAT), r(lon + D_LON), r(lat + D_LAT)].join("%2C");
  const src = srcOverride || `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
  const link = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`;

  return (
    <div className={`flex flex-col overflow-hidden rounded-xl border border-line ${className}`}>
      <iframe title={`Мы на карте — ${address}`} src={src} className="min-h-0 w-full flex-1" loading="lazy" allowFullScreen />
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-surface-2 px-3 py-2 text-center font-mono text-xs uppercase tracking-widest text-muted hover:text-ink"
      >
        {address} — открыть карту ↗
      </a>
    </div>
  );
}
