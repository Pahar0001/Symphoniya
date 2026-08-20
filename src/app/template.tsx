"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

// Мягкий переход между страницами (только opacity — без transform).
// На главной пропускаем: там pinned scroll-jack галереи, а обёртка motion
// мешает измерению sticky-высоты. Уважает prefers-reduced-motion.
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  if (reduce || pathname === "/") return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
