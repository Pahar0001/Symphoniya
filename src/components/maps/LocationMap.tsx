// Бесплатная карта на OpenStreetMap (iframe-эмбед). Не требует ключей/регистрации,
// работает в РФ. Координаты и адрес шоурума задаются здесь; при необходимости
// можно переопределить готовым src Яндекс-карты через NEXT_PUBLIC_YANDEX_MAP_SRC
// (например, если у заказчика появится карточка в Яндекс.Бизнесе).

// Тимирязевская ул., 2/3, Москва
const LAT = 55.8079;
const LON = 37.5733;
const ADDRESS = "Москва, Тимирязевская ул., 2/3";

// bbox для эмбеда OSM (небольшая область вокруг точки).
const D_LON = 0.008;
const D_LAT = 0.004;
const r = (n: number) => n.toFixed(6);
const bbox = [r(LON - D_LON), r(LAT - D_LAT), r(LON + D_LON), r(LAT + D_LAT)].join("%2C");

const OSM_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${LAT}%2C${LON}`;
const OSM_LINK = `https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LON}#map=17/${LAT}/${LON}`;

export function LocationMap({ className = "" }: { className?: string }) {
  // Если заказчик задаст готовый src (Яндекс-конструктор/Бизнес) — используем его.
  const src = process.env.NEXT_PUBLIC_YANDEX_MAP_SRC || OSM_SRC;

  return (
    <div className={`overflow-hidden rounded-xl border border-line ${className}`}>
      <iframe
        title={`Мы на карте — ${ADDRESS}`}
        src={src}
        className="h-full w-full"
        loading="lazy"
        allowFullScreen
      />
      <a
        href={OSM_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-surface-2 px-3 py-2 text-center font-mono text-xs uppercase tracking-widest text-muted hover:text-fg"
      >
        {ADDRESS} — открыть карту ↗
      </a>
    </div>
  );
}
