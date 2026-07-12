import type { HeroMedia as HeroMediaType } from "@/lib/site-content";

// Рендер медиа героя: фото или зацикленное видео (autoplay, muted, без звука).
// Наполнение задаётся в src/lib/site-content.ts.
export function HeroMedia({ media }: { media: HeroMediaType }) {
  if (media.type === "video") {
    return (
      <video
        className="h-full w-full object-cover"
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={media.alt ?? "Видео интерьера"}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={media.src} alt={media.alt ?? ""} className="h-full w-full object-cover" />
  );
}
