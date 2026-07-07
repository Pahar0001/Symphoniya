"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-graphite-900/50 p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full max-w-lg rounded-lg bg-cream-50 p-6 shadow-xl sm:p-8",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="mb-4 font-heading text-2xl text-graphite-800">{title}</h3>
        )}
        {children}
      </div>
    </div>
  );
}
