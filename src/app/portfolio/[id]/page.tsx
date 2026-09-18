import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ProjectPhotos } from "@/components/portfolio/ProjectPhotos";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import { prisma } from "@/lib/db";
import { catLabel } from "@/lib/portfolio-categories";
import { getSiteSettings } from "@/lib/site-settings";
import { telHref } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = await prisma.portfolioItem.findUnique({ where: { id: params.id } });
  if (!item) return { title: "Проект" };
  return { title: item.title, description: item.description ?? undefined };
}

export default async function PortfolioCasePage({ params }: { params: { id: string } }) {
  const item = await prisma.portfolioItem.findUnique({ where: { id: params.id } });
  if (!item) notFound();

  const settings = await getSiteSettings();
  const mainSalon = settings.salons[0];
  const categoryLabel = catLabel(item.category);
  const meta = [item.material, item.city, item.year].filter(Boolean);

  // Похожие работы той же категории.
  const related = await prisma.portfolioItem.findMany({
    where: { category: item.category, isPublished: true, id: { not: item.id } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: 3,
  });

  return (
    <section className="section">
      <TrackEvent type="project_view" meta={{ id: item.id, title: item.title, category: item.category }} />
      <Container>
        <Link href="/portfolio" className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-brass">
          ← Все работы
        </Link>

        {/* Слева — фото одного формата, справа — описание (на десктопе «прилипает» при прокрутке фото) */}
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProjectPhotos photos={[item.image, ...item.gallery]} title={item.title} />
          </div>

          <div className="order-first lg:order-none lg:col-span-5">
            <div className="lg:sticky lg:top-40">
              <Link
                href={`/portfolio?cat=${item.category}`}
                className="font-mono text-[11px] uppercase tracking-widest text-brass hover:underline"
              >
                {categoryLabel}
              </Link>
              <h1 className="mt-3 text-balance font-display text-3xl leading-[1.05] text-ink sm:text-4xl">{item.title}</h1>
              {item.complex && <p className="mt-3 text-lg text-ink">ЖК {item.complex}</p>}
              {meta.length > 0 && (
                <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted">{meta.join(" · ")}</p>
              )}
              {item.zones.length > 0 && (
                <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-muted">{item.zones.join(" · ")}</p>
              )}
              {item.description && (
                <div className="mt-8 border-t border-line pt-6">
                  <h2 className="mb-3 font-display text-xl text-ink">О проекте</h2>
                  <p className="whitespace-pre-line leading-relaxed text-muted">{item.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* «Понравился проект?» — слева надпись, справа соцсети-иконки и телефон */}
        <div className="mt-12 flex flex-col gap-6 border-y border-line py-8 sm:mt-16 sm:flex-row sm:items-center sm:justify-between sm:py-10">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">{settings.projectCtaTitle}</h2>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <SocialLinks socials={settings.socials} />
            <a
              href={telHref(mainSalon.phone)}
              className="whitespace-nowrap font-display text-2xl text-ink transition-colors hover:text-brass sm:text-3xl"
            >
              {mainSalon.phone}
            </a>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12 sm:mt-16">
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
