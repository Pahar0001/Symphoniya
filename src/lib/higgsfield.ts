// REST-клиент Higgsfield для живой генерации изображений (text-to-image).
// Документация: POST https://platform.higgsfield.ai/{model_id} → { request_id, status_url };
// GET https://platform.higgsfield.ai/requests/{request_id}/status → { status, images:[{url}] }.
// Авторизация: заголовок  Authorization: Key {KEY_ID}:{KEY_SECRET}.
//
// Ключи только в окружении (никогда в коде/коммитах):
//   HIGGSFIELD_KEY_ID + HIGGSFIELD_KEY_SECRET  либо  HIGGSFIELD_CREDENTIALS="id:secret".

const BASE = "https://platform.higgsfield.ai";

export const HIGGSFIELD_IMAGE_MODEL =
  process.env.HIGGSFIELD_IMAGE_MODEL || "higgsfield-ai/soul/standard";

export function higgsfieldCredentials(): string | null {
  const combined = process.env.HIGGSFIELD_CREDENTIALS;
  if (combined && combined.includes(":")) return combined.trim();
  const id = process.env.HIGGSFIELD_KEY_ID;
  const secret = process.env.HIGGSFIELD_KEY_SECRET;
  if (id && secret) return `${id.trim()}:${secret.trim()}`;
  return null;
}

export function isHiggsfieldConfigured(): boolean {
  return higgsfieldCredentials() !== null;
}

function authHeader(): string {
  return `Key ${higgsfieldCredentials()}`;
}

const TERMINAL = ["completed", "failed", "nsfw", "canceled", "cancelled"];
export function isTerminalStatus(status: string): boolean {
  return TERMINAL.includes(status);
}

export interface SubmitResult {
  requestId: string;
  status: string;
}

// Ставит задачу генерации в очередь, возвращает request_id для поллинга.
export async function submitImage(
  prompt: string,
  opts?: { aspectRatio?: string; resolution?: string }
): Promise<SubmitResult> {
  const res = await fetch(`${BASE}/${HIGGSFIELD_IMAGE_MODEL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: authHeader() },
    body: JSON.stringify({
      prompt,
      aspect_ratio: opts?.aspectRatio ?? process.env.HIGGSFIELD_ASPECT_RATIO ?? "4:3",
      resolution: opts?.resolution ?? process.env.HIGGSFIELD_RESOLUTION ?? "1080p",
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Higgsfield submit ${res.status}: ${body}`);
  }
  const d = (await res.json()) as { request_id?: string; status?: string };
  if (!d.request_id) throw new Error("Higgsfield submit: нет request_id в ответе");
  return { requestId: d.request_id, status: d.status ?? "queued" };
}

export interface PollResult {
  status: string;
  imageUrl?: string;
}

// Проверяет статус задачи; при completed возвращает URL изображения.
export async function pollImage(requestId: string): Promise<PollResult> {
  const res = await fetch(`${BASE}/requests/${requestId}/status`, {
    headers: { Authorization: authHeader() },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Higgsfield status ${res.status}`);
  const d = (await res.json()) as { status?: string; images?: { url?: string }[] };
  const imageUrl = Array.isArray(d.images) && d.images[0]?.url ? d.images[0]!.url : undefined;
  return { status: d.status ?? "queued", imageUrl };
}
