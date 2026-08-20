import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { articlesByCategory } from "@/lib/articles";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Журнал — о мебели на заказ",
  description:
    "Журнал «Симфонии»: материалы, планировки, столешницы и фурнитура. Коротко и по делу — что выбрать под задачу и бюджет.",
};

type Entry = { href: string; title: string; summary: string; category: string; n?: number };

export default function JournalPage() {
  const guides: Entry[] = GUIDES.map((g) => ({
    href: `/stati/${g.slug}`,
    title: g.title,
    summary: g.summary,
    category: "Гайды",
  }));
  const rest: Entry[] = articlesByCategory().flatMap((g) =>
    g.items.map((it) => ({ href: it.href, title: it.title, summary: it.summary, category: g.category }))
  );

  const all = [...guides, ...rest];
  const [lead, ...others] = all;

  // Группировка «хвоста» по рубрикам для оглавления. Нумерация — сквозная.
  const groups: { category: string; items: Entry[] }[] = [];
  others.forEach((e, i) => {
    const entry = { ...e, n: i + 2 }; // 01 занят ведущим материалом
    let g = groups.find((x) => x.category === entry.category);
    if (!g) {
      g = { category: entry.category, items: [] };
      groups.push(g);
    }
    g.items.push(entry);
  });

  return (
    <>
      {/* ── Масткед журнала ── */}
      <header className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow">Журнал</p>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <h1 className="max-w-3xl font-display text-[clamp(2.6rem,6vw,5rem)] font-medium leading-[0.98] text-ink">
                О мебели — честно<br />и по делу
              </h1>
              <p className="max-w-sm text-muted">
                Разбираем материалы, планировки и фурнитуру, чтобы выбор был спокойным, а бюджет —
                предсказуемым.
              </p>
            </div>
          </Reveal>
        </Container>
      </header>

      {/* ── Ведущий материал ── */}
      {lead && (
        <section className="border-b border-line">
          <Container>
            <Reveal>
              <Link
                href={lead.href}
                className="group grid gap-8 py-14 sm:py-20 lg:grid-cols-[0.42fr_0.58fr] lg:items-center"
              >
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-brass">
                    {lead.category} · Читать первым
                  </span>
                  <div className="mt-6 font-mono text-6xl text-line transition-colors group-hover:text-brass-soft sm:text-7xl">
                    01
                  </div>
                </div>
                <div>
                  <h2 className="font-display text-3xl leading-tight text-ink transition-colors group-hover:text-brass sm:text-5xl">
                    {lead.title}
                  </h2>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{lead.summary}</p>
                  <span className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink">
                    Читать материал
                    <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          </Container>
        </section>
      )}

      {/* ── Оглавление по рубрикам ── */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-x-16 gap-y-16 lg:grid-cols-[0.28fr_0.72fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Содержание</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {all.length} материалов о том, из чего складывается мебель на заказ.
            </p>
          </div>

          <div className="space-y-16">
            {groups.map((g) => (
              <div key={g.category}>
                <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-brass">
                  {g.category}
                </h3>
                <ul>
                  {g.items.map((it, i) => (
                    <li key={it.href}>
                      <Reveal delay={i * 30}>
                        <Link
                          href={it.href}
                          className="group flex items-baseline gap-5 border-b border-line py-6 transition-colors hover:border-brass"
                        >
                          <span className="w-8 shrink-0 font-mono text-xs text-muted">
                            {String(it.n ?? i + 2).padStart(2, "0")}
                          </span>
                          <span className="flex-1">
                            <span className="block font-display text-xl text-ink transition-colors group-hover:text-brass sm:text-2xl">
                              {it.title}
                            </span>
                            <span className="mt-1 block max-w-2xl text-sm leading-relaxed text-muted">
                              {it.summary}
                            </span>
                          </span>
                          <span className="hidden shrink-0 self-center text-muted transition-transform duration-500 group-hover:translate-x-1 group-hover:text-brass sm:block">
                            →
                          </span>
                        </Link>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
