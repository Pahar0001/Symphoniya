"use client";

import { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

// Форма отзыва → на модерацию (публикует администратор).
export function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: String(form.get("author") ?? ""),
        city: String(form.get("city") ?? ""),
        rating,
        text: String(form.get("text") ?? ""),
      }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setStatus("error");
      setError(d.error ?? "Ошибка");
      return;
    }
    setStatus("ok");
    (e.target as HTMLFormElement).reset();
    setRating(5);
  }

  if (status === "ok") {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 text-ink">
        Спасибо за отзыв! Он появится на сайте после модерации.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-xl border border-line bg-surface p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="author" label="Имя" required />
        <Input name="city" label="Город (необязательно)" />
      </div>
      <div>
        <span className="mb-1.5 block text-sm text-muted">Оценка</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => setRating(i)}
              aria-label={`${i} звёзд`}
              className="p-0.5"
            >
              <svg viewBox="0 0 24 24" className={`h-7 w-7 transition-colors ${i <= rating ? "text-brass" : "text-line"}`} fill="currentColor">
                <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <Textarea name="text" label="Ваш отзыв" placeholder="Расскажите о проекте и работе с нами" required />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={status === "sending"} withArrow={status !== "sending"}>
        {status === "sending" ? "Отправляем…" : "Оставить отзыв"}
      </Button>
    </form>
  );
}
