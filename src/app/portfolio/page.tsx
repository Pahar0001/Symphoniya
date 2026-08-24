import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PortfolioIndex } from "@/components/portfolio/PortfolioIndex";
import { ButtonLink } from "@/components/ui/Button";
import { FILTER_CATEGORIES, ZHK_SLUG, catLabel, isValidCategory } from "@/lib/portfolio-categories";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Проекты — выполненные работы",
  description:
    "Кухни, шкафы, гардеробные и сан-узлы на заказ, а также комплексные проекты в ЖК. Реализованные работы «Симфонии» — под конкретное пространство и сценарий жизни.",
};
export const dynamic = "force-dynamic";

function chip(active: boolean): string {
  return `border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
    active ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink hover:text-ink"
  }`;
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  // Категория — ветка мебели ИЛИ отдельная плашка «ЖК» (комплексные проекты).
  const cat = isValidCategory(searchParams?.cat) ? searchParams!.cat! : undefined;
  const isZhk = cat === ZHK_SLUG;

  const items = await prisma.portfolioItem.findMany({
    where: { isPublished: true, ...(cat ? { category: cat } : {}) },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const title = isZhk ? <>Проекты в&nbsp;ЖК</> : cat ? catLabel(cat) : <>Реализованные<br />работы</>;
  const subtitle = isZhk
    ? "Комплексные проекты: вся квартира или объект целиком — кухня, гардеробная, спальня, санузел и прихожая в едином материале и стиле."
    : "Каждый проект — под конкретное пространство и сценарий жизни. Кухни, шкафы, гардеробные и сан-узлы, спроектированные как архитектура.";

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
              <h1 className="display-lg max-w-3xl text-ink">{title}</h1>
              <p className="max-w-sm text-muted">{subtitle}</p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-8 flex flex-wrap gap-2">
              <Link href="/portfolio" className={chip(!cat)}>Все</Link>
              {FILTER_CATEGORIES.map((c) => (
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
