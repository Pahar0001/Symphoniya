import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { LayoutSchematic } from "@/components/articles/LayoutSchematic";
import { CRITERIA_ARTICLES, getArticle } from "@/lib/articles";
import { GUIDES, getGuide } from "@/lib/guides";

export function generateStaticParams() {
  return [...CRITERIA_ARTICLES, ...GUIDES].map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = getGuide(params.slug);
  if (guide) return { title: guide.title, description: guide.summary };
  const a = getArticle(params.slug);
  if (!a) return { title: "Статья" };
  return { title: a.title, description: a.summary };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  if (guide) return <GuideView guide={guide} />;

  const a = getArticle(params.slug);
  if (!a) notFound();

  const related = CRITERIA_ARTICLES.filter((x) => x.category === a.category && x.slug !== a.slug);

  return (
    <section className="section">
      <Container className="max-w-3xl">
        <Link href="/stati" className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-brass">
          ← Все статьи
        </Link>

        {/* Схема планировки или тонированная заставка */}
        {a.schematic ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-line bg-surface-2 p-6">
            <div className="mx-auto aspect-[200/140] max-w-md">
              <LayoutSchematic kind={a.schematic} />
            </div>
          </div>
        ) : (
          <div
            className="mt-6 h-40 rounded-xl"
            style={{ background: `linear-gradient(135deg, ${a.tint}, ${a.tint}bb)` }}
          />
        )}

        <div className="mt-6 font-mono text-[11px] uppercase tracking-widest text-brass">{a.category}</div>
        <h1 className="mt-2 font-display text-4xl text-ink">{a.title}</h1>
        <p className="mt-3 text-lg leading-relaxed text-muted">{a.summary}</p>

        <div className="mt-8">
          <h2 className="mb-3 font-display text-2xl text-ink">Что это</h2>
          <p className="leading-relaxed text-muted">{a.what}</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="font-mono text-[11px] uppercase tracking-widest text-brass">Плюсы</div>
            <ul className="mt-3 space-y-2">
              {a.pros.map((p) => (
                <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                  <span className="mt-0.5 text-brass">+</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted">Минусы</div>
            <ul className="mt-3 space-y-2">
              {a.cons.map((c) => (
                <li key={c} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                  <span className="mt-0.5 text-muted">−</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-brass/40 bg-surface-2 p-6">
          <div className="font-mono text-[11px] uppercase tracking-widest text-brass">Кому подходит</div>
          <p className="mt-2 leading-relaxed text-ink">{a.bestFor}</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/raschet">Учесть в расчёте</ButtonLink>
          <ButtonLink href="/kontakty" variant="outline">Обсудить проект</ButtonLink>
        </div>

        {related.length > 0 && (
          <div className="mt-16 border-t border-line pt-8">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted">
              Ещё в разделе «{a.category}»
            </div>
            <div className="flex flex-wrap gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/stati/${r.slug}`}
                  className="rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-brass"
                >
                  {r.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

function GuideView({ guide }: { guide: (typeof GUIDES)[number] }) {
  const others = GUIDES.filter((g) => g.slug !== guide.slug);
  return (
    <section className="section">
      <Container className="max-w-3xl">
        <Link href="/stati" className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-brass">
          ← Все статьи
        </Link>

        <div className="mt-6 h-40 rounded-xl" style={{ background: `linear-gradient(135deg, ${guide.tint}, ${guide.tint}bb)` }} />

        <div className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-brass">
          <span>Гайд</span>
          <span className="text-muted">·</span>
          <span className="text-muted">{guide.readMin} мин чтения</span>
        </div>
        <h1 className="mt-2 font-display text-4xl text-ink">{guide.title}</h1>
        <p className="mt-3 text-lg leading-relaxed text-muted">{guide.summary}</p>

        <article className="mt-8 space-y-8">
          {guide.sections.map((s, i) => (
            <div key={i}>
              {s.heading && <h2 className="mb-3 font-display text-2xl text-ink">{s.heading}</h2>}
              {s.paragraphs?.map((p, j) => (
                <p key={j} className="mb-3 leading-relaxed text-muted">{p}</p>
              ))}
              {s.list && (
                <ul className="space-y-2">
                  {s.list.map((li) => (
                    <li key={li} className="flex gap-2.5 leading-relaxed text-muted">
                      <span className="mt-1 text-brass">·</span>
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </article>

        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/raschet">Рассчитать кухню</ButtonLink>
          <ButtonLink href="/kontakty" variant="outline">Обсудить проект</ButtonLink>
        </div>

        {others.length > 0 && (
          <div className="mt-16 border-t border-line pt-8">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted">Другие гайды</div>
            <div className="flex flex-wrap gap-3">
              {others.map((g) => (
                <Link
                  key={g.slug}
                  href={`/stati/${g.slug}`}
                  className="rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-brass"
                >
                  {g.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
