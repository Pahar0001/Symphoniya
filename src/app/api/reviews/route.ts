import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { reviewSchema } from "@/lib/validators";

export const runtime = "nodejs";

// Приём отзыва с сайта — создаётся неопубликованным (на модерацию).
export async function POST(req: Request) {
  try {
    const parsed = reviewSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Проверьте поля" },
        { status: 400 }
      );
    }
    const { author, city, rating, text } = parsed.data;
    await prisma.review.create({
      data: { author, city: city || null, rating, text, source: "site", isPublished: false },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("reviews error:", e);
    return NextResponse.json({ error: "Не удалось отправить отзыв" }, { status: 500 });
  }
}
