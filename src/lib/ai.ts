import Anthropic from "@anthropic-ai/sdk";

// ── ИИ-консультант: несколько провайдеров ────────────────────────
// Приоритет автоопределения по наличию ключа:
//   1) Groq  (GROQ_API_KEY)   — бесплатный ключ, OpenAI-совместимый, быстрый (Llama)
//   2) Gemini (GEMINI_API_KEY) — бесплатный ключ Google AI Studio, OpenAI-совместимый
//   3) Anthropic (ANTHROPIC_API_KEY) — Claude Haiku (платно)
// Явно провайдера можно задать переменной AI_PROVIDER = groq | gemini | anthropic.
// Все ключи — только в окружении, никогда в клиентском коде.

type Provider = "groq" | "gemini" | "anthropic" | "none";

function detectProvider(): Provider {
  const explicit = process.env.AI_PROVIDER as Provider | undefined;
  if (explicit && explicit !== "none") return explicit;
  if (process.env.GROQ_API_KEY) return "groq";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return "none";
}

const OPENAI_COMPAT: Record<"groq" | "gemini", { base: string; keyEnv: string; model: string }> = {
  groq: {
    base: "https://api.groq.com/openai/v1",
    keyEnv: "GROQ_API_KEY",
    model: process.env.AI_MODEL ?? "llama-3.3-70b-versatile",
  },
  gemini: {
    base: "https://generativelanguage.googleapis.com/v1beta/openai",
    keyEnv: "GEMINI_API_KEY",
    model: process.env.AI_MODEL ?? "gemini-2.0-flash",
  },
};

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

const FALLBACK =
  "ИИ-консультант пока не подключён. Оставьте имя и телефон — менеджер перезвонит и всё расскажет.";

export function aiConfigured(): boolean {
  return detectProvider() !== "none";
}

async function askOpenAICompatible(provider: "groq" | "gemini", messages: ChatMessage[]): Promise<string> {
  const cfg = OPENAI_COMPAT[provider];
  const res = await fetch(`${cfg.base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env[cfg.keyEnv]}`,
    },
    body: JSON.stringify({
      model: cfg.model,
      max_tokens: 512,
      messages: [{ role: "system", content: CONSULTANT_SYSTEM_PROMPT }, ...messages],
    }),
  });
  if (!res.ok) throw new Error(`${provider} error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content ?? "").trim();
}

async function askAnthropic(messages: ChatMessage[]): Promise<string> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await anthropic.messages.create({
    model: process.env.AI_MODEL ?? process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: CONSULTANT_SYSTEM_PROMPT,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });
  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

export async function askConsultant(messages: ChatMessage[]): Promise<string> {
  const provider = detectProvider();
  if (provider === "none") return FALLBACK;
  const text =
    provider === "anthropic"
      ? await askAnthropic(messages)
      : await askOpenAICompatible(provider, messages);
  return text || "Извините, не удалось сформировать ответ. Оставьте телефон — мы перезвоним.";
}
