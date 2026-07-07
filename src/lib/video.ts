// Модуль виртуализации квартиры по планировке через видеогенерацию.
// Задел на будущее: провайдер переключается переменной VIDEO_PROVIDER (none|runway|higgsfield).
// Пока провайдер = none — задание создаётся в статусе queued, реальный вызов API добавим позже.

export type VideoProvider = "none" | "runway" | "higgsfield";

export function currentProvider(): VideoProvider {
  return (process.env.VIDEO_PROVIDER as VideoProvider) ?? "none";
}

export function isVideoEnabled(): boolean {
  return currentProvider() !== "none";
}

export interface VirtualizationInput {
  inputUrl: string; // ссылка на загруженную планировку
  prompt?: string;
}

export interface VirtualizationResult {
  provider: VideoProvider;
  status: "queued" | "processing" | "done" | "failed";
  resultUrl?: string;
  note?: string;
}

// Заглушка вызова провайдера. Реализация Runway/Higgsfield подключается здесь.
export async function requestVirtualization(
  input: VirtualizationInput
): Promise<VirtualizationResult> {
  const provider = currentProvider();
  if (provider === "none") {
    return {
      provider,
      status: "queued",
      note: "Видеогенерация не подключена (VIDEO_PROVIDER=none). Заявка сохранена, менеджер свяжется.",
    };
  }
  // TODO: реальный вызов API провайдера (Runway/Higgsfield) с input.inputUrl и input.prompt.
  return { provider, status: "processing", note: "Задание передано провайдеру видеогенерации." };
}
