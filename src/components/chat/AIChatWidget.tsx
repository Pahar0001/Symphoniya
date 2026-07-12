"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChatPanel } from "@/components/chat/ChatPanel";

// Плавающий виджет ИИ-консультанта в правом нижнем углу (все публичные страницы).
export function AIChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Не показываем виджет в админ-панели (там встроенный ассистент).
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-ink px-6 py-4 text-sm text-paper shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5"
        >
          <span className="h-2 w-2 rounded-full bg-brass" />
          Консультант онлайн
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-40 flex h-[32rem] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
          <div className="flex items-center justify-between border-b border-line bg-surface-2 px-4 py-3">
            <span className="flex items-center gap-2 font-display text-lg text-ink">
              <span className="h-2 w-2 rounded-full bg-brass" /> ИИ-консультант
            </span>
            <button onClick={() => setOpen(false)} aria-label="Закрыть" className="text-xl text-muted hover:text-ink">
              ×
            </button>
          </div>
          <ChatPanel className="flex-1 overflow-hidden" />
        </div>
      )}
    </>
  );
}
