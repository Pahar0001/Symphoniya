import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import { prisma } from "@/lib/db";
import { facadeSlugFromText, getMaterial } from "@/lib/materials";
import { catLabel } from "@/lib/portfolio-categories";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = await prisma.portfolioItem.findUnique({ where: { id: params.id } });
  if (!item) return { title: "Проект" };
  return { title: item.title, description: item.description ?? undefined };
}

export default async function PortfolioCasePage({ params }: { params: { id: string } }) {
  const item = await prisma.portfolioItem.findUnique({ where: { id: params.id } });
  if (!item) notFound();

  const categoryLabel = catLabel(item.category);
  const categoryHref = `/portfolio?cat=${item.category}`;
  const facadeSlug = facadeSlugFromText(item.material);
  const facade = facadeSlug ? getMaterial(facadeSlug) : undefined;

  // Похожие работы той же категории.
  const related = await prisma.portfolioItem.findMany({
    where: { category: item.category, isPublished: true, id: { not: item.id } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: 3,
  });

  return (
    <section className="section">
      <TrackEvent type="project_view" meta={{ id: item.id, title: item.title, category: item.category }} />
      <Container className="max-w-4xl">
        <Link href="/portfolio" className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-brass">
          ← Все работы
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} className="aspect-[16/10] w-full object-cover" />
        </div>

        {item.gallery.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {item.gallery.map((src, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={i}
                src={src}
                alt={`${item.title} — фото ${i + 2}`}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-xl border border-line object-cover"
              />
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-muted">
          <span className="text-brass">{categoryLabel}</span>
          {item.city && <><span>·</span><span>{item.city}</span></>}
          {item.year && <><span>·</span><span>{item.year}</span></>}
        </div>
        <h1 className="mt-2 font-display text-4xl text-ink">{item.title}</h1>

        {item.description && (
          <div className="mt-6">
            <h2 className="mb-2 font-display text-2xl text-ink">О проекте</h2>
            <p className="leading-relaxed text-muted">{item.description}</p>
          </div>
        )}

        {/* Параметры проекта со ссылками */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted">Тип</div>
            <Link href={categoryHref} className="mt-1 inline-block text-ink hover:text-brass">{categoryLabel} →</Link>
          </div>
          {item.material && (
            <div className="rounded-xl border border-line bg-surface p-5">
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted">Материал</div>
              {facade ? (
                <Link href={`/fasady/${facade.slug}`} className="mt-1 inline-block text-ink hover:text-brass">
                  {item.material} →
                </Link>
              ) : (
                <div className="mt-1 text-ink">{item.material}</div>
              )}
            </div>
          )}
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted">Срок</div>
            <div className="mt-1 text-ink">4–8 недель</div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/kontakty">Обсудить похожий проект</ButtonLink>
          <ButtonLink href="/portfolio" variant="outline">Другие проекты</ButtonLink>
        </div>

        {related.length > 0 && (
          <div className="mt-16 border-t border-line pt-8">
            <div className="mb-5 font-mono text-[11px] uppercase tracking-widest text-muted">Ещё работы</div>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/portfolio/${r.id}`} className="group overflow-hidden rounded-xl border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image} alt={r.title} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="p-4">
                    <div className="font-display text-ink">{r.title}</div>
                    {r.city && <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted">{r.city}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
