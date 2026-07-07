import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requestVirtualization, currentProvider } from "@/lib/video";

export const runtime = "nodejs";

const schema = z.object({
  inputUrl: z.string().min(1, "Нужна ссылка на планировку"),
  prompt: z.string().max(1000).optional(),
  leadId: z.string().optional(),
  orderId: z.string().optional(),
});

// Запуск виртуализации квартиры по планировке (Runway/аналог).
// Задел на будущее: пока VIDEO_PROVIDER=none задание ставится в очередь.
export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Проверьте поля" },
        { status: 400 }
      );
    }
    const { inputUrl, prompt, leadId, orderId } = parsed.data;

    const result = await requestVirtualization({ inputUrl, prompt });

    const job = await prisma.generationJob.create({
      data: {
        leadId,
        orderId,
        provider: currentProvider() === "none" ? "runway" : currentProvider(),
        status: result.status,
        inputUrl,
        prompt,
        resultUrl: result.resultUrl,
      },
    });

    return NextResponse.json({ jobId: job.id, status: result.status, note: result.note });
  } catch (e) {
    console.error("video generate error:", e);
    return NextResponse.json({ error: "Не удалось создать задание" }, { status: 500 });
  }
}
