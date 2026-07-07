"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { ChatMessage } from "@/lib/ai";

// Плавающий виджет ИИ-консультанта в правом нижнем углу (все публичные страницы).
export function AIChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Здравствуйте! Я консультант «Симфонии мебели». Подскажу по материалам, срокам и стилям. Что вас интересует?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        { role: "assistant", content: data.reply ?? "Извините, попробуйте ещё раз." },
      ]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Ошибка соединения. Оставьте телефон — мы перезвоним." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Не показываем виджет в админ-панели.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-graphite-800 px-6 py-4 text-sm text-cream-50 shadow-lg transition hover:bg-graphite-700"
        >
          Консультант онлайн
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-40 flex h-[32rem] w-[92vw] max-w-sm flex-col overflow-hidden rounded-lg border border-wood-200 bg-cream-50 shadow-2xl">
          <div className="flex items-center justify-between border-b border-wood-100 bg-cream-100 px-4 py-3">
            <span className="font-heading text-lg text-graphite-800">ИИ-консультант</span>
            <button onClick={() => setOpen(false)} aria-label="Закрыть" className="text-xl text-graphite-500">
              ×
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-lg bg-graphite-800 px-3 py-2 text-sm text-cream-50"
                    : "mr-auto max-w-[85%] rounded-lg bg-cream-100 px-3 py-2 text-sm text-graphite-700"
                }
              >
                {m.content}
              </div>
            ))}
            {loading && <div className="text-sm text-graphite-400">Печатает…</div>}
          </div>

          <div className="flex gap-2 border-t border-wood-100 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ваш вопрос…"
              className="flex-1 rounded-md border border-wood-200 px-3 py-2 text-sm focus:border-wood-400 focus:outline-none"
            />
            <button
              onClick={send}
              disabled={loading}
              className="rounded-md bg-wood-500 px-4 text-sm text-cream-50 disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
