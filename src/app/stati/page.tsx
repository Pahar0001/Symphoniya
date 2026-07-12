import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionNav } from "@/components/ui/SectionNav";
import { articlesByCategory } from "@/lib/articles";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Статьи",
  description:
    "Разбираемся в материалах, планировках, столешницах и фурнитуре: что выбрать под задачу и бюджет, плюсы и минусы каждого решения.",
};

export default function ArticlesHubPage() {
  const guidesGroup = {
    category: "Гайды",
    items: GUIDES.map((g) => ({ href: `/stati/${g.slug}`, title: g.title, summary: g.summary })),
  };
  const groups = [guidesGroup, ...articlesByCategory()];

  return (
    <>
      <CategoryHero
        eyebrow="База знаний"
        title="Статьи"
        description="Коротко и по делу о том, из чего складывается мебель на заказ. Поможем выбрать без переплат и разочарований."
      />
      <section className="section">
        <Container>
          <SectionNav items={groups.map((g, i) => ({ id: `cat-${i}`, label: g.category }))} />
        </Container>
        <Container className="space-y-16">
          {groups.map((g, gi) => (
            <div key={g.category} id={`cat-${gi}`} className="scroll-mt-28">
              <h2 className="mb-6 font-display text-2xl text-ink sm:text-3xl">{g.category}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((it, i) => (
                  <Reveal key={it.href} delay={(gi + i) * 40}>
                    <Link
                      href={it.href}
                      className="group flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-colors hover:border-brass"
                    >
                      <h3 className="font-display text-xl text-ink transition-colors group-hover:text-brass">
                        {it.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{it.summary}</p>
                      <span className="mt-4 font-mono text-[11px] uppercase tracking-widest text-brass">
                        Читать →
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
