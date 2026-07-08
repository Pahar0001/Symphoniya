import { NextResponse } from "next/server";
import { askConsultant } from "@/lib/ai";
import { buildSiteContext } from "@/lib/ai-context";
import { chatSchema } from "@/lib/validators";

export const runtime = "nodejs";

// Прокси к ИИ-провайдеру. Ключи — только на сервере. Данные сайта подгружаются в промпт.
export async function POST(req: Request) {
  try {
    const parsed = chatSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
    }
    let siteContext: string | undefined;
    try {
      siteContext = await buildSiteContext();
    } catch {
      // Если БД недоступна — отвечаем без контекста каталога.
    }
    const reply = await askConsultant(parsed.data.messages, siteContext);
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("ai-chat error:", e);
    // Мягкий ответ пользователю без раскрытия внутренних деталей.
    return NextResponse.json({
      reply:
        "Извините, консультант сейчас недоступен. Оставьте имя и телефон — менеджер перезвонит и всё подскажет.",
    });
  }
}
