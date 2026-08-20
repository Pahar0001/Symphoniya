import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { MetaRow } from "@/components/layout/GridOverlay";
import { MATERIALS } from "@/lib/materials";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Материалы и фактуры",
  description:
    "Натуральные материалы фасадов: ЛДСП, МДФ-эмаль, шпон и массив дуба. Честные фактуры без плёнок «под дерево».",
};

// Приглушённая палитра отделки.
const finishes = [
  { name: "Тёплый белый", hex: "#EFE7D6" },
  { name: "Песочный", hex: "#D8C3A0" },
  { name: "Графит", hex: "#4A4A4E" },
  { name: "Антрацит", hex: "#2B2B30" },
  { name: "Тёмное дерево", hex: "#4A3423" },
  { name: "Олива", hex: "#6E6B42" },
];

export default function FasadyPage() {
  return (
    <>
      {/* ── Масткед ── */}
      <header className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow">Материалы</p>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-8">
              <h1 className="display-lg max-w-3xl text-ink">Материалы<br />и фактуры</h1>
              <p className="max-w-sm text-muted">
                Массив, шпон, эмаль. Честные фактуры без плёнок «под дерево» — так, как выглядит
                настоящий материал.
              </p>
            </div>
          </Reveal>
        </Container>
      </header>

      {/* ── Бренды: материалы и фурнитура ── */}
      <section className="border-b border-line">
        <Container className="grid gap-8 py-10 sm:grid-cols-2">
          <div>
            <span className="label text-ink/60">Материалы фасадов</span>
            <p className="mt-3 font-display text-2xl leading-tight text-ink">
              Эмаль · Плёнка · AGT · Egger · Arpa · Fenix
            </p>
          </div>
          <div>
            <span className="label text-ink/60">Фурнитура</span>
            <p className="mt-3 font-display text-2xl leading-tight text-ink">
              Blum · Hettich · Boyard · Samet · DTC
            </p>
          </div>
        </Container>
      </section>

      {/* ── Editorial-индекс материалов ── */}
      <section className="pb-8 pt-6 sm:pt-10">
        <Container>
          <MetaRow index="01" label="Материалы фасадов" right={`01 — ${String(MATERIALS.length).padStart(2, "0")}`} />
          <div className="mt-4">
            {MATERIALS.map((m, i) => {
              const n = String(i + 1).padStart(2, "0");
              const left = i % 2 === 0;
              return (
                <Reveal key={m.slug}>
                  <Link
                    href={`/fasady/${m.slug}`}
                    data-cursor="Читать"
                    className="group grid items-center gap-6 border-t border-line py-8 lg:grid-cols-12 lg:gap-8 lg:py-12"
                  >
                    <div
                      className={`relative aspect-[16/10] overflow-hidden lg:col-span-7 ${left ? "lg:order-1" : "lg:order-2"}`}
                      style={{ background: `linear-gradient(135deg, ${m.tint}, ${m.tint}bb 60%, ${m.tint}77)` }}
                    >
                      <span className="absolute left-5 top-5 num text-sm text-black/45">{n}</span>
                      <span className="absolute bottom-5 left-5 font-display text-3xl tracking-tight text-black/55 sm:text-4xl">
                        {m.name}
                      </span>
                    </div>
                    <div className={`lg:col-span-5 ${left ? "lg:order-2" : "lg:order-1"}`}>
                      <div className="label mb-4 flex items-center gap-4">
                        <span className="text-ink/60">{n}</span>
                        <span className="h-px flex-1 bg-line" />
                        <span>Уровень {m.tier}/4</span>
                      </div>
                      <h2 className="font-display text-4xl leading-[0.98] tracking-tight text-ink transition-colors group-hover:text-brass sm:text-5xl">
                        {m.name}
                      </h2>
                      <p className="mt-4 max-w-md leading-relaxed text-muted">{m.tagline}</p>
                      <ul className="mt-5 space-y-1.5">
                        {m.strengths.slice(0, 3).map((s) => (
                          <li key={s} className="flex gap-3 text-sm leading-relaxed text-muted">
                            <span className="mt-2 h-px w-3 shrink-0 bg-brass" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 flex items-center gap-6">
                        <span className="num text-sm text-ink">{formatPrice(m.pricePerUnit, true)}</span>
                        <span className="label">{m.lifespan}</span>
                        <span className="ml-auto inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
                          Читать
                          <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Сравнение ── */}
      <section className="border-t border-line py-16 sm:py-24">
        <Container>
          <MetaRow index="02" label="Сравнение материалов" right="₽ за пог.м / кв.м" />
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="label border-b border-line [&>th]:pb-3 [&>th]:pr-4 [&>th]:font-normal">
                  <th>Материал</th>
                  <th>Цена</th>
                  <th>Срок службы</th>
                  <th>Где выгоднее</th>
                </tr>
              </thead>
              <tbody>
                {MATERIALS.map((m) => (
                  <tr key={m.slug} className="border-b border-line [&>td]:py-4 [&>td]:pr-4">
                    <td>
                      <Link href={`/fasady/${m.slug}`} className="text-ink transition-colors hover:text-brass">
                        {m.name}
                      </Link>
                    </td>
                    <td className="num text-ink">{formatPrice(m.pricePerUnit, true)}</td>
                    <td className="text-muted">{m.lifespan}</td>
                    <td className="text-muted">{m.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">
            Цены ориентировочные. Точная стоимость — после замера.
          </p>
        </Container>
      </section>

      {/* ── Палитра ── */}
      <section className="border-t border-line py-16 sm:py-24">
        <Container>
          <MetaRow index="03" label="Палитра отделки" right="6 тонов" />
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
            {finishes.map((f) => (
              <div key={f.name} className="bg-paper">
                <div className="aspect-square w-full" style={{ background: f.hex }} />
                <div className="px-3 py-3">
                  <div className="text-sm text-ink">{f.name}</div>
                  <div className="num mt-0.5 text-[11px] uppercase text-muted">{f.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
