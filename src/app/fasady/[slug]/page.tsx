import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { MATERIALS, getMaterial } from "@/lib/materials";
import { formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return MATERIALS.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const m = getMaterial(params.slug);
  if (!m) return { title: "Материал" };
  return {
    title: `${m.name} — ${m.tagline}`,
    description: m.lead,
  };
}

export default function MaterialArticlePage({ params }: { params: { slug: string } }) {
  const m = getMaterial(params.slug);
  if (!m) notFound();

  return (
    <section className="section">
      <Container className="max-w-3xl">
        <Link href="/fasady" className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-brass">
          ← Все материалы
        </Link>

        <div
          className="mt-6 h-40 rounded-xl"
          style={{ background: `linear-gradient(135deg, ${m.tint}, ${m.tint}bb)` }}
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-brass">
            Уровень {m.tier}/4
          </span>
          <span className="text-muted">·</span>
          <span className="text-sm text-ink">{formatPrice(m.pricePerUnit, true)}</span>
          <span className="text-muted">·</span>
          <span className="text-sm text-muted">Срок службы {m.lifespan}</span>
        </div>

        <h1 className="mt-3 font-display text-4xl text-ink">{m.name}</h1>
        <p className="mt-2 text-lg text-brass">{m.tagline}</p>
        <p className="mt-6 text-lg leading-relaxed text-muted">{m.lead}</p>

        <Section title="Сильные стороны">
          <ul className="space-y-2">
            {m.strengths.map((s) => (
              <li key={s} className="flex gap-3 text-muted">
                <span className="mt-1 text-brass">+</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="О чём честно предупредить">
          <ul className="space-y-2">
            {m.considerations.map((s) => (
              <li key={s} className="flex gap-3 text-muted">
                <span className="mt-1 text-muted">−</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Почему это выгодно">
          <div className="space-y-4">
            {m.value.map((p) => (
              <p key={p} className="leading-relaxed text-muted">{p}</p>
            ))}
          </div>
        </Section>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <InfoCard label="Кому подходит">{m.bestFor}</InfoCard>
          <InfoCard label="Уход">{m.care}</InfoCard>
        </div>

        <div className="mt-10 rounded-xl border border-brass/40 bg-surface-2 p-6">
          <div className="font-mono text-[11px] uppercase tracking-widest text-brass">Вывод</div>
          <p className="mt-2 text-lg leading-relaxed text-ink">{m.verdict}</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/katalog">Подобрать в каталоге</ButtonLink>
          <ButtonLink href="/kontakty" variant="outline">Обсудить проект</ButtonLink>
        </div>

        {/* Другие материалы */}
        <div className="mt-16 border-t border-line pt-8">
          <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted">
            Другие материалы
          </div>
          <div className="flex flex-wrap gap-3">
            {MATERIALS.filter((o) => o.slug !== m.slug).map((o) => (
              <Link
                key={o.slug}
                href={`/fasady/${o.slug}`}
                className="rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-brass"
              >
                {o.name}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10">
      <h2 className="mb-4 font-display text-2xl text-ink">{title}</h2>
      {children}
    </div>
  );
}

function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="font-mono text-[11px] uppercase tracking-widest text-muted">{label}</div>
      <p className="mt-2 text-sm leading-relaxed text-ink">{children}</p>
    </div>
  );
}
