import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { leadSchema } from "@/lib/validators";

export const runtime = "nodejs";

// Приём заявок (форма обратного звонка / чат / checkout) → создаётся Lead.
export async function POST(req: Request) {
  try {
    const parsed = leadSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Проверьте поля" },
        { status: 400 }
      );
    }
    const lead = await prisma.lead.create({ data: parsed.data });
    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (e) {
    console.error("leads error:", e);
    return NextResponse.json({ error: "Не удалось сохранить заявку" }, { status: 500 });
  }
}
