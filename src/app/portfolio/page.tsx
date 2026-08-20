import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PortfolioIndex } from "@/components/portfolio/PortfolioIndex";
import { ButtonLink } from "@/components/ui/Button";
import { PORTFOLIO_CATEGORIES, catLabel } from "@/lib/portfolio-categories";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Проекты — выполненные работы",
  description:
    "Кухни, шкафы, гардеробные и сан-узлы на заказ. Реализованные проекты «Симфонии» — под конкретное пространство и сценарий жизни.",
};
export const dynamic = "force-dynamic";

function chip(active: boolean): string {
  return `border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
    active ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink hover:text-ink"
  }`;
}

export default async function PortfolioPage({ searchParams }: { searchParams: { cat?: string } }) {
  const cat = PORTFOLIO_CATEGORIES.find((c) => c.slug === searchParams?.cat)?.slug;
  const items = await prisma.portfolioItem.findMany({
    where: { isPublished: true, ...(cat ? { category: cat } : {}) },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <>
      {/* ── Масткед ── */}
      <header className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow">Проекты</p>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-8">
              <h1 className="display-lg max-w-3xl text-ink">
                {cat ? catLabel(cat) : <>Реализованные<br />работы</>}
              </h1>
              <p className="max-w-sm text-muted">
                Каждый проект — под конкретное пространство и сценарий жизни. Кухни, шкафы,
                гардеробные и сан-узлы, спроектированные как&nbsp;архитектура.
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-8 flex flex-wrap gap-2">
              <Link href="/portfolio" className={chip(!cat)}>Все</Link>
              {PORTFOLIO_CATEGORIES.map((c) => (
                <Link key={c.slug} href={`/portfolio?cat=${c.slug}`} className={chip(cat === c.slug)}>
                  {c.label}
                </Link>
              ))}
            </div>
          </Reveal>
        </Container>
      </header>

      <section className="pb-8 pt-8 sm:pt-12">
        <Container>
          <PortfolioIndex items={items} />
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-line py-16 sm:py-24">
        <Container className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 className="display-lg text-ink lg:col-span-8">Хотите так&nbsp;же?</h2>
          <div className="flex flex-wrap items-center gap-4 lg:col-span-4 lg:justify-end">
            <ButtonLink href="/kontakty" withArrow>Обсудить проект</ButtonLink>
            <ButtonLink href="/portfolio" variant="outline">Все проекты</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
