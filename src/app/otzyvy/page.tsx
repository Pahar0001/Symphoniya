import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/reviews/Stars";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { YandexReviews } from "@/components/reviews/YandexReviews";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Отзывы клиентов" };
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  const avg = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  return (
    <>
      <CategoryHero
        eyebrow="Отзывы"
        title="Что говорят клиенты"
        description="Реальные отзывы о проектах и работе мастерской. И с сайта, и с Яндекс.Карт."
      />
      <section className="section">
        <Container>
          {reviews.length > 0 && (
            <div className="mb-10 flex flex-wrap items-center gap-6 rounded-xl border border-line bg-surface p-6">
              <div className="font-display text-5xl text-ink">{avg}</div>
              <div>
                <Stars value={Math.round(avg)} />
                <div className="mt-1 font-mono text-xs uppercase tracking-wider text-muted">
                  {reviews.length} отзыв(ов)
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={Math.min(i, 6) * 60}>
                <figure className="flex h-full flex-col rounded-xl border border-line bg-surface p-6">
                  <Stars value={r.rating} className="mb-3" />
                  <blockquote className="flex-1 text-ink">«{r.text}»</blockquote>
                  <figcaption className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-sm text-ink">
                      {r.author}
                      {r.city && <span className="text-muted"> · {r.city}</span>}
                    </span>
                    {r.source === "yandex" && (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Яндекс</span>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          {/* Отзывы с Яндекс.Карт (если задан ID организации) */}
          <div className="mt-16">
            <YandexReviews />
          </div>

          {/* Оставить отзыв */}
          <div className="mt-16 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow mb-4">Ваше мнение</p>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">Оставьте отзыв</h2>
              <p className="mt-3 max-w-md text-muted">
                Поделитесь впечатлением о проекте — это помогает нам и будущим клиентам. Отзыв
                появится после модерации.
              </p>
            </div>
            <ReviewForm />
          </div>
        </Container>
      </section>
    </>
  );
}
