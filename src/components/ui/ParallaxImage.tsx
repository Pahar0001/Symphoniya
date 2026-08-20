"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

// Аккуратный parallax изображения на motion. Контейнер задаёт пропорции
// (aspect-*) и overflow-hidden; картинка чуть увеличена, чтобы сдвиг не
// открывал края. Уважает prefers-reduced-motion.
export function ParallaxImage({
  src,
  alt,
  className = "",
  strength = 10,
  priority = false,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        {...(priority ? { fetchPriority: "high" as const } : {})}
        style={reduce ? { scale: 1 } : { y, scale: 1.16 }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {children}
    </div>
  );
}
