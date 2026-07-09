import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { AutoRefresh } from "@/components/visualization/AutoRefresh";
import { prisma } from "@/lib/db";
import {
  buildPrompt,
  describeConfig,
  curatedImage,
  currentVisualizationProvider,
  visualizationConfigSchema,
  type VisualizationConfig,
} from "@/lib/visualization";
import { isHiggsfieldConfigured, submitImage, pollImage, isTerminalStatus } from "@/lib/higgsfield";

export const metadata: Metadata = { title: "Ваша ИИ-визуализация" };
export const dynamic = "force-dynamic";

type JobRow = NonNullable<Awaited<ReturnType<typeof prisma.generationJob.findUnique>>>;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default async function VisualizationResultPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { dev?: string };
}) {
  const job = await prisma.generationJob.findUnique({ where: { id: params.id } });
  if (!job) notFound();

  const dev = searchParams.dev === "1";
  const order = job.orderId
    ? await prisma.order.findUnique({ where: { id: job.orderId } })
    : null;
  const paid = dev || order?.status === "paid";

  const parsed = visualizationConfigSchema.safeParse(job.prompt ? safeJson(job.prompt) : null);

  if (!paid) return <WaitState kind="payment" />;
  if (!parsed.success) return <ErrorState />;

  const config = parsed.data;

  // В дев-режиме фиксируем оплату, чтобы результат сохранялся и без вебхука.
  if (dev && order && order.status !== "paid") {
    await prisma.order.update({ where: { id: order.id }, data: { status: "paid" } });
  }

  const resolved = await resolveImage(job, config);
  if (!resolved.done) return <WaitState kind="rendering" />;

  const chips = describeConfig(config);
  const prompt = buildPrompt(config);

  return (
    <section className="section">
      <Container className="max-w-4xl">
        <div className="mb-6 text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-brass">
            ИИ-визуализация
          </div>
          <h1 className="mt-2 font-display text-4xl text-ink">Ваш проект в интерьере</h1>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolved.url}
            alt="ИИ-визуализация вашей мебели по параметрам расчёта"
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{prompt}</p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Визуализация носит ознакомительный характер и передаёт стиль, материалы и общее
          настроение проекта. Точная геометрия — после замера.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/kontakty">Получить точный расчёт</ButtonLink>
          <ButtonLink href="/raschet" variant="outline">Новый расчёт</ButtonLink>
        </div>
      </Container>
    </section>
  );
}

// ── Оркестрация: живая генерация Higgsfield с фолбэком на курированный рендер ──
async function resolveImage(
  job: JobRow,
  config: VisualizationConfig
): Promise<{ done: true; url: string } | { done: false }> {
  if (job.status === "done" && job.resultUrl) return { done: true, url: job.resultUrl };

  const live = currentVisualizationProvider() === "higgsfield" && isHiggsfieldConfigured();

  if (!live) {
    const url = curatedImage(config);
    await prisma.generationJob.update({ where: { id: job.id }, data: { status: "done", resultUrl: url } });
    return { done: true, url };
  }

  try {
    // request_id храним в поле inputUrl (переиспользуем).
    let requestId = job.inputUrl || null;
    if (!requestId) {
      const sub = await submitImage(buildPrompt(config));
      requestId = sub.requestId;
      await prisma.generationJob.update({
        where: { id: job.id },
        data: { status: "processing", inputUrl: requestId },
      });
    }

    // Короткий инлайн-поллинг (~12 c). Не готово — покажем «рендерим…» с авто-обновлением.
    let last = await pollImage(requestId);
    for (let i = 0; i < 6 && !isTerminalStatus(last.status); i++) {
      await sleep(2000);
      last = await pollImage(requestId);
    }

    if (last.status === "completed" && last.imageUrl) {
      await prisma.generationJob.update({
        where: { id: job.id },
        data: { status: "done", resultUrl: last.imageUrl },
      });
      return { done: true, url: last.imageUrl };
    }

    if (!isTerminalStatus(last.status)) return { done: false }; // ещё рендерится
    // failed / nsfw / canceled → уходим в фолбэк ниже
    console.error("higgsfield generation non-success status:", last.status);
  } catch (e) {
    console.error("higgsfield generation error:", e);
  }

  // Фолбэк: платящий клиент всегда получает изображение.
  const url = curatedImage(config);
  await prisma.generationJob.update({
    where: { id: job.id },
    data: { status: "done", resultUrl: url },
  });
  return { done: true, url };
}

function WaitState({ kind }: { kind: "payment" | "rendering" }) {
  const rendering = kind === "rendering";
  return (
    <section className="section">
      <Container className="max-w-xl text-center">
        {rendering && <AutoRefresh seconds={6} />}
        <div className="mb-6 text-5xl">{rendering ? "🎨" : "⏳"}</div>
        <h1 className="font-display text-4xl text-ink">
          {rendering ? "Рендерим вашу визуализацию…" : "Ожидаем оплату"}
        </h1>
        <p className="mt-4 text-muted">
          {rendering
            ? "Обычно это занимает до минуты. Страница обновится автоматически — не закрывайте её."
            : "Как только платёж пройдёт, здесь появится ваша визуализация. Если вы уже оплатили — обновите страницу через минуту."}
        </p>
        {!rendering && (
          <div className="mt-8">
            <ButtonLink href="/raschet">Вернуться к расчёту</ButtonLink>
          </div>
        )}
      </Container>
    </section>
  );
}

function ErrorState() {
  return (
    <section className="section">
      <Container className="max-w-xl text-center">
        <h1 className="font-display text-3xl text-ink">Не удалось собрать визуализацию</h1>
        <p className="mt-4 text-muted">Параметры расчёта повреждены. Попробуйте оформить заново.</p>
        <div className="mt-8">
          <ButtonLink href="/raschet">К расчёту</ButtonLink>
        </div>
      </Container>
    </section>
  );
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
