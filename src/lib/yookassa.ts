import { randomUUID } from "crypto";

// Обёртка над ЮKassa REST API.
// Сценарии: предоплата/задаток за проект, оплата платных услуг ИИ-агента,
// (в перспективе) оплата виртуализации квартиры.
const SHOP_ID = process.env.YOOKASSA_SHOP_ID;
const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY;
const API_URL = "https://api.yookassa.ru/v3";

export function isYooKassaConfigured(): boolean {
  return Boolean(SHOP_ID && SECRET_KEY);
}

function authHeader(): string {
  return "Basic " + Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString("base64");
}

export interface CreatePaymentInput {
  amountRub: number; // сумма в рублях
  description: string;
  returnUrl: string; // куда вернуть пользователя после оплаты
  metadata?: Record<string, string>;
}

export interface YooPayment {
  id: string;
  status: string;
  confirmation?: { confirmation_url?: string };
}

export async function createPayment(input: CreatePaymentInput): Promise<YooPayment> {
  if (!isYooKassaConfigured()) {
    throw new Error("ЮKassa не настроена: задайте YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY");
  }
  const res = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotence-Key": randomUUID(),
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      amount: { value: input.amountRub.toFixed(2), currency: "RUB" },
      capture: true,
      confirmation: { type: "redirect", return_url: input.returnUrl },
      description: input.description,
      metadata: input.metadata ?? {},
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ЮKassa create payment failed: ${res.status} ${body}`);
  }
  return (await res.json()) as YooPayment;
}

export async function getPayment(paymentId: string): Promise<YooPayment> {
  const res = await fetch(`${API_URL}/payments/${paymentId}`, {
    headers: { Authorization: authHeader() },
  });
  if (!res.ok) throw new Error(`ЮKassa get payment failed: ${res.status}`);
  return (await res.json()) as YooPayment;
}
