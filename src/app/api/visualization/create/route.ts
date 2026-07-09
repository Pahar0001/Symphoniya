import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createPayment, isYooKassaConfigured } from "@/lib/yookassa";
import { visualizationConfigSchema, buildPrompt, AI_IMAGE_PRICE } from "@/lib/visualization";

export const runtime = "nodejs";

const bodySchema = z.object({
  config: visualizationConfigSchema,
  customerName: z.string().min(2, "Укажите имя"),
  phone: z.string().min(6, "Укажите телефон"),
  email: z.string().email().optional().or(z.literal("")),
});

// Создаёт заказ на платную ИИ-визуализацию (200 ₽) и платёж в ЮKassa.
// Конфигурация калькулятора сохраняется в GenerationJob; результат раскрывается
// на /visualizaciya/[id] после оплаты (webhook отмечает Order как paid).
export async function POST(req: Request) {
  try {
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Проверьте поля" },
        { status: 400 }
      );
    }
    const { config, customerName, phone, email } = parsed.data;

    const order = await prisma.order.create({
      data: {
        customerName,
        phone,
        email: email || null,
        kind: "ai_service",
        totalAmount: AI_IMAGE_PRICE,
        status: "pending",
      },
    });

    const job = await prisma.generationJob.create({
      data: {
        orderId: order.id,
        provider: "higgsfield",
        status: "awaiting_payment",
        prompt: JSON.stringify(config),
      },
    });

    const resultPath = `/visualizaciya/${job.id}`;

    if (!isYooKassaConfigured()) {
      // Дев-режим без ключей ЮKassa: сразу ведём на страницу результата (?dev=1).
      return NextResponse.json({ url: `${resultPath}?dev=1`, devMode: true });
    }

    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const payment = await createPayment({
      amountRub: AI_IMAGE_PRICE,
      description: buildPrompt(config).slice(0, 120),
      returnUrl: `${site}${resultPath}`,
      metadata: { orderId: order.id, jobId: job.id, kind: "visualization" },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { yookassaPaymentId: payment.id },
    });

    return NextResponse.json({ url: payment.confirmation?.confirmation_url ?? resultPath });
  } catch (e) {
    console.error("visualization create error:", e);
    return NextResponse.json({ error: "Не удалось создать заказ визуализации" }, { status: 500 });
  }
}
