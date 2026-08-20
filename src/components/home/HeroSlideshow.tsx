"use client";

import { useEffect, useState } from "react";

// Плавная смена фотографий на герое (кросс-фейд + лёгкий ken-burns).
// Уважает prefers-reduced-motion (тогда — только первый кадр, без автосмены).
export function HeroSlideshow({
  images,
  interval = 4600,
  className = "",
  children,
}: {
  images: string[];
  interval?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const [idx, setIdx] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (images.length < 2) return;
    setAnimate(true);
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden={i !== idx}
          draggable={false}
          loading={i === 0 ? "eager" : "lazy"}
          {...(i === 0 ? { fetchPriority: "high" as const } : {})}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-symphony ${
            i === idx ? "opacity-100" : "opacity-0"
          } ${animate && i === idx ? "hero-kenburns" : ""}`}
        />
      ))}
      {children}
    </div>
  );
}
