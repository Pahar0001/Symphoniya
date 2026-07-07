import Anthropic from "@anthropic-ai/sdk";

// Обёртка над Anthropic Claude API для ИИ-консультанта.
// Ключ только в окружении, никогда в клиентском коде.
const apiKey = process.env.ANTHROPIC_API_KEY;

export const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

export const AI_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001";

// Системный промпт консультанта «Симфонии мебели».
export const CONSULTANT_SYSTEM_PROMPT = `
Ты — вежливый онлайн-консультант мебельной компании «Симфония мебели» (Москва).
Компания производит на заказ: кухни и корпусную мебель. Ранее работала под брендом THE WOOD.

Твои задачи:
- Отвечать по существу на вопросы о материалах (массив дуба, МДФ/эмаль, шпон, ЛДСП), сроках
  изготовления (ориентир 4–8 недель), стилях (классика, хай-тек, модерн, постмодерн), уходе.
- НЕ называть точные цены. Говори «от такой-то суммы» или «рассчитаем индивидуально по проекту».
- Мягко подводить клиента к тому, чтобы оставить имя и телефон для расчёта — но без навязчивости.
- Если клиент оставляет контакт, поблагодари и подтверди, что менеджер свяжется.
- Отвечай кратко, спокойно, статусно. Русский язык.

Дополнительные услуги, которые можно предложить при интересе:
- Расширенная консультация ИИ-дизайнера (подбор конфигурации).
- Виртуализация квартиры по планировке (видео-обход интерьера).

Если вопрос вне темы мебели/компании — вежливо верни разговор к мебели.
`.trim();

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function askConsultant(messages: ChatMessage[]): Promise<string> {
  if (!anthropic) {
    return "ИИ-консультант временно недоступен (не задан ANTHROPIC_API_KEY). Оставьте телефон — менеджер перезвонит.";
  }
  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 512,
    system: CONSULTANT_SYSTEM_PROMPT,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });
  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  return text || "Извините, не удалось сформировать ответ. Оставьте телефон — мы перезвоним.";
}
