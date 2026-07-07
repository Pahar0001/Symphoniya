"use client";

import { useState } from "react";
import { useCart, formatPrice } from "@/lib/cart";
import { CartSummary } from "@/components/checkout/CartSummary";
import { Input } from "@/components/ui/Input";
import { PaymentButton } from "@/components/checkout/PaymentButton";

const DEPOSIT_SHARE = 0.3; // задаток 30% за индивидуальный проект

export function CheckoutForm() {
  const { items, total } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [kind, setKind] = useState<"deposit" | "full">("deposit");

  const sum = total();
  const amount = kind === "deposit" ? Math.round(sum * DEPOSIT_SHARE) : sum;
  const ready = name.trim().length >= 2 && phone.trim().length >= 7 && items.length > 0;

  if (items.length === 0) {
    return <p className="text-graphite-500">Корзина пуста — добавьте товары из каталога.</p>;
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <h2 className="mb-6 font-heading text-2xl text-graphite-800">Ваш заказ</h2>
        <CartSummary editable={false} />
      </div>

      <div className="rounded-lg bg-cream-100 p-6 sm:p-8">
        <h2 className="mb-6 font-heading text-2xl text-graphite-800">Контакты и оплата</h2>
        <div className="grid gap-4">
          <Input label="Имя" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Input label="E-mail (для чека)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <fieldset className="grid gap-2">
            <label className="flex items-center gap-3 rounded-md border border-wood-200 bg-surface p-3">
              <input type="radio" checked={kind === "deposit"} onChange={() => setKind("deposit")} />
              <span className="text-graphite-700">
                Задаток 30% — {formatPrice(Math.round(sum * DEPOSIT_SHARE), false)}
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-md border border-wood-200 bg-surface p-3">
              <input type="radio" checked={kind === "full"} onChange={() => setKind("full")} />
              <span className="text-graphite-700">Полная оплата — {formatPrice(sum, false)}</span>
            </label>
          </fieldset>

          <div className="mt-2 flex items-center justify-between text-lg">
            <span className="text-graphite-600">К оплате</span>
            <span className="font-medium text-graphite-800">{formatPrice(amount, false)}</span>
          </div>

          {ready ? (
            <PaymentButton
              kind={kind}
              amountRub={amount}
              getPayload={() => ({
                customerName: name,
                phone,
                email: email || undefined,
                items: items.map((i) => ({
                  productId: i.productId,
                  title: i.title,
                  qty: i.qty,
                  price: i.price,
                })),
              })}
            />
          ) : (
            <p className="text-sm text-graphite-400">Заполните имя и телефон для перехода к оплате.</p>
          )}
        </div>
      </div>
    </div>
  );
}
