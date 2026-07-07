"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

// Запуск оплаты ЮKassa: создаёт заказ/платёж и редиректит на confirmation_url.
export function PaymentButton({
  kind,
  amountRub,
  getPayload,
  label = "Перейти к оплате",
}: {
  kind: "deposit" | "full" | "ai_service" | "virtualization";
  amountRub: number;
  getPayload: () => {
    customerName: string;
    phone: string;
    email?: string;
    items?: { productId?: string; title: string; qty: number; price: number }[];
  };
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/yookassa/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, amountRub, ...getPayload() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не удалось создать платёж");
      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
      } else {
        throw new Error("ЮKassa не вернула ссылку на оплату");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка оплаты");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={pay} disabled={loading} className="w-full">
        {loading ? "Создаём платёж…" : label}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
