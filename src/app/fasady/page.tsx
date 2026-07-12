import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { Reveal } from "@/components/ui/Reveal";
import { FasadyStage } from "@/components/fasady/FasadyStage";
import { MATERIALS, MATERIALS_INTRO } from "@/lib/materials";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Фасады и материалы",
  description:
    "Честное сравнение материалов фасадов: ЛДСП, МДФ-эмаль, шпон и массив дуба. Где выгодно сэкономить, а где переплата окупается сроком службы.",
};

// Реальные оттенки палитры — приглушённые тёплые тона.
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
      <CategoryHero
        eyebrow="Материалы"
        title="Фасады и отделка"
        description="Спокойные фактуры и приглушённые цвета — основа статусного, ненавязчивого интерьера."
      />
      <section className="section">
        <Container>
          {/* Интерактивная сцена — стиль и фон меняются под выбранный материал */}
          <div className="mb-14">
            <FasadyStage
              materials={MATERIALS.map((m) => ({
                slug: m.slug,
                name: m.name,
                tagline: m.tagline,
                tint: m.tint,
                pricePerUnit: m.pricePerUnit,
                lifespan: m.lifespan,
                strengths: m.strengths,
              }))}
            />
          </div>

          {/* Сквозная маркетинговая мысль */}
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="text-lg leading-relaxed text-muted">{MATERIALS_INTRO}</p>
          </div>

          {/* Карточки-статьи по материалам */}
          <div className="grid gap-6 sm:grid-cols-2">
            {MATERIALS.map((m, i) => (
              <Reveal key={m.slug} delay={i * 80}>
                <Link
                  href={`/fasady/${m.slug}`}
                  className="group block h-full rounded-xl border border-line bg-surface p-8 transition-colors hover:border-brass"
                >
                  <div
                    className="mb-5 h-28 rounded-lg"
                    style={{ background: `linear-gradient(135deg, ${m.tint}, ${m.tint}cc)` }}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-2xl text-ink">{m.name}</h3>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                      Уровень {m.tier}/4
                    </span>
                  </div>
                  <p className="mt-2 text-muted">{m.tagline}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-sm text-ink">{formatPrice(m.pricePerUnit, true)}</span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-brass group-hover:underline">
                      Читать →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Компактное сравнение */}
          <h2 className="mb-6 mt-20 font-display text-3xl text-ink">Сравнение материалов</h2>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Материал</th>
                  <th className="px-4 py-3 font-medium">Цена</th>
                  <th className="px-4 py-3 font-medium">Срок службы</th>
                  <th className="px-4 py-3 font-medium">Где выгоднее</th>
                </tr>
              </thead>
              <tbody>
                {MATERIALS.map((m) => (
                  <tr key={m.slug} className="border-t border-line">
                    <td className="px-4 py-3">
                      <Link href={`/fasady/${m.slug}`} className="text-ink hover:text-brass">
                        {m.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink">{formatPrice(m.pricePerUnit, true)}</td>
                    <td className="px-4 py-3 text-muted">{m.lifespan}</td>
                    <td className="px-4 py-3 text-muted">{m.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">
            Цены ориентировочные, за пог.м (кухня) или кв.м (корпус). Точная стоимость — после замера.
          </p>

          {/* Палитра */}
          <h2 className="mb-8 mt-20 font-display text-3xl text-ink">Палитра</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {finishes.map((f, i) => (
              <Reveal key={f.name} delay={i * 60}>
                <div className="overflow-hidden rounded-xl border border-line bg-surface">
                  <div className="h-24 w-full" style={{ background: f.hex }} />
                  <div className="px-4 py-3">
                    <div className="text-sm text-ink">{f.name}</div>
                    <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted">{f.hex}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
