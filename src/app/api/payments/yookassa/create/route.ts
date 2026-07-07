import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createPayment, isYooKassaConfigured } from "@/lib/yookassa";
import { createPaymentSchema } from "@/lib/validators";

export const runtime = "nodejs";

// Создаёт Order (pending) и платёж в ЮKassa, возвращает confirmation_url.
export async function POST(req: Request) {
  try {
    const parsed = createPaymentSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Проверьте поля" },
        { status: 400 }
      );
    }
    const { kind, customerName, phone, email, amountRub, items } = parsed.data;

    const order = await prisma.order.create({
      data: {
        customerName,
        phone,
        email,
        kind,
        totalAmount: Math.round(amountRub),
        status: "pending",
        items: items?.length
          ? {
              create: items.map((i) => ({
                productId: i.productId,
                title: i.title,
                qty: i.qty,
                price: i.price,
              })),
            }
          : undefined,
      },
    });

    if (!isYooKassaConfigured()) {
      // Дев-режим без ключей: возвращаем ссылку на страницу успеха, чтобы протестировать поток UI.
      return NextResponse.json({
        confirmationUrl: `/checkout/success?dev=1&order=${order.id}`,
        devMode: true,
      });
    }

    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const payment = await createPayment({
      amountRub,
      description: `Заказ ${order.id} (${kind})`,
      returnUrl: `${site}/checkout/success?order=${order.id}`,
      metadata: { orderId: order.id, kind },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { yookassaPaymentId: payment.id },
    });

    return NextResponse.json({
      confirmationUrl: payment.confirmation?.confirmation_url,
      orderId: order.id,
    });
  } catch (e) {
    console.error("yookassa create error:", e);
    return NextResponse.json({ error: "Не удалось создать платёж" }, { status: 500 });
  }
}
