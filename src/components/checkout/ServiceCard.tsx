"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { PaymentButton } from "@/components/checkout/PaymentButton";
import { formatPrice } from "@/lib/cart";

// Карточка платной услуги с формой контакта и оплатой через ЮKassa.
export function ServiceCard({
  slug,
  title,
  description,
  price,
  kind,
}: {
  slug: string;
  title: string;
  description: string;
  price: number;
  kind: "ai_service" | "virtualization";
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const ready = name.trim().length >= 2 && phone.trim().length >= 7;

  return (
    <div className="flex flex-col rounded-lg border border-wood-100 bg-white p-8">
      <h3 className="font-heading text-2xl text-graphite-800">{title}</h3>
      <p className="mt-2 flex-1 text-graphite-500">{description}</p>
      <p className="mt-4 text-xl text-wood-600">{formatPrice(price, false)}</p>

      <div className="mt-6 grid gap-3">
        <Input placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
        {ready ? (
          <PaymentButton
            kind={kind}
            amountRub={price}
            label="Оплатить услугу"
            getPayload={() => ({
              customerName: name,
              phone,
              items: [{ title, qty: 1, price }],
            })}
          />
        ) : (
          <p className="text-sm text-graphite-400">Заполните имя и телефон для оплаты.</p>
        )}
      </div>

      {kind === "virtualization" && (
        <p className="mt-4 text-xs text-graphite-400">
          После оплаты вы сможете загрузить планировку — мы сгенерируем видео-обход интерьера.
        </p>
      )}
    </div>
  );
}
