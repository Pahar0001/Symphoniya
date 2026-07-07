import { NextResponse } from "next/server";
import { askConsultant } from "@/lib/ai";
import { chatSchema } from "@/lib/validators";

export const runtime = "nodejs";

// Прокси к Claude API для чата на сайте. Ключ — только на сервере.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
    }
    const reply = await askConsultant(parsed.data.messages);
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("ai-chat error:", e);
    return NextResponse.json(
      { error: "Сервис консультанта временно недоступен" },
      { status: 500 }
    );
  }
}
