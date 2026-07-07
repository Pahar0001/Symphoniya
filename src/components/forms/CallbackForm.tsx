"use client";

import { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

// Форма обратного звонка → POST /api/leads → создаётся Lead в БД.
export function CallbackForm({ source = "callback_form" }: { source?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      message: String(form.get("message") ?? ""),
      source,
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Не удалось отправить заявку");
      }
      setStatus("ok");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Ошибка");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-lg border border-wood-200 bg-cream-100 p-6 text-graphite-700">
        Спасибо! Мы приняли заявку и перезвоним в ближайшее время.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Input name="name" label="Имя" placeholder="Как к вам обращаться" required />
      <Input name="phone" label="Телефон" placeholder="+7 (___) ___-__-__" required />
      <Textarea name="message" label="Комментарий" placeholder="Опишите задачу (необязательно)" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Отправляем…" : "Заказать звонок"}
      </Button>
      <p className="text-xs text-graphite-400">
        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
      </p>
    </form>
  );
}
