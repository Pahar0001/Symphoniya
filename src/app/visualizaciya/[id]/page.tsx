import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { prisma } from "@/lib/db";
import {
  generateVisualization,
  describeConfig,
  visualizationConfigSchema,
} from "@/lib/visualization";

export const metadata: Metadata = { title: "Ваша ИИ-визуализация" };
export const dynamic = "force-dynamic";

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

  const parsed = visualizationConfigSchema.safeParse(
    job.prompt ? safeJson(job.prompt) : null
  );

  if (!paid) {
    return (
      <section className="section">
        <Container className="max-w-xl text-center">
          <div className="mb-6 text-5xl">⏳</div>
          <h1 className="font-display text-4xl text-ink">Ожидаем оплату</h1>
          <p className="mt-4 text-muted">
            Как только платёж пройдёт, здесь появится ваша визуализация. Если вы уже оплатили —
            обновите страницу через минуту.
          </p>
          <div className="mt-8">
            <ButtonLink href="/raschet">Вернуться к расчёту</ButtonLink>
          </div>
        </Container>
      </section>
    );
  }

  if (!parsed.success) {
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

  const config = parsed.data;

  // В дев-режиме фиксируем оплату, чтобы результат сохранялся и без вебхука.
  if (dev && order && order.status !== "paid") {
    await prisma.order.update({ where: { id: order.id }, data: { status: "paid" } });
  }

  const result = await generateVisualization(config);
  if (job.status !== "done" || !job.resultUrl) {
    await prisma.generationJob.update({
      where: { id: job.id },
      data: { status: "done", resultUrl: result.imageUrl },
    });
  }

  const chips = describeConfig(config);

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
            src={result.imageUrl}
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
            <p className="mt-4 text-sm leading-relaxed text-muted">{result.prompt}</p>
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

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
