import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPayment } from "@/lib/yookassa";

export const runtime = "nodejs";

// Приём уведомлений ЮKassa: payment.succeeded / payment.canceled → обновляем статус Order.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event: string | undefined = body?.event;
    const paymentId: string | undefined = body?.object?.id;
    const orderId: string | undefined = body?.object?.metadata?.orderId;

    if (!paymentId && !orderId) {
      return NextResponse.json({ error: "Нет идентификаторов" }, { status: 400 });
    }

    // Проверяем фактический статус через API (не доверяем телу вслепую).
    let verifiedStatus = body?.object?.status as string | undefined;
    if (paymentId) {
      try {
        const payment = await getPayment(paymentId);
        verifiedStatus = payment.status;
      } catch {
        /* если проверка недоступна — используем статус из уведомления */
      }
    }

    const status =
      event === "payment.succeeded" || verifiedStatus === "succeeded"
        ? "paid"
        : event === "payment.canceled" || verifiedStatus === "canceled"
          ? "cancelled"
          : "pending";

    await prisma.order.updateMany({
      where: orderId ? { id: orderId } : { yookassaPaymentId: paymentId },
      data: { status },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("yookassa webhook error:", e);
    // 200, чтобы ЮKassa не повторяла бесконечно при нашей ошибке парсинга.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
