"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/ai";

// Переиспользуемая панель диалога с ИИ-консультантом.
// Используется и в плавающем виджете, и во встроенном окне админ-панели.
export function ChatPanel({ className = "" }: { className?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Здравствуйте! Я консультант «Симфонии мебели». Подскажу по материалам, срокам и стилям. Что вас интересует?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

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
      setMessages([...next, { role: "assistant", content: data.reply ?? "Извините, попробуйте ещё раз." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Ошибка соединения. Оставьте телефон — мы перезвоним." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-ink px-3.5 py-2.5 text-sm text-paper"
                : "mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-surface-2 px-3.5 py-2.5 text-sm text-ink"
            }
          >
            {m.content}
          </div>
        ))}
        {loading && <div className="font-mono text-xs uppercase tracking-widest text-muted">печатает…</div>}
      </div>

      <div className="flex gap-2 border-t border-line p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ваш вопрос…"
          className="flex-1 rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brass"
        />
        <button
          onClick={send}
          disabled={loading}
          aria-label="Отправить"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brass text-paper transition-transform hover:scale-105 disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
}
