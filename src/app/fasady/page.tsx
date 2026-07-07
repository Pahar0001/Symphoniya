import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = { title: "Фасады и отделка" };

const materials = [
  { name: "Массив дуба", desc: "Натуральная древесина с выраженной текстурой, ручная патина.", tint: "#8a5a2f" },
  { name: "Эмаль (МДФ)", desc: "Матовые и глянцевые покрытия в приглушённых оттенках.", tint: "#e7dcc9" },
  { name: "Шпон ореха", desc: "Тёплая природная фактура для акцентных поверхностей.", tint: "#5a3c26" },
  { name: "ЛДСП премиум", desc: "Практичные фактуры для систем хранения, устойчивы к износу.", tint: "#b7a488" },
];

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
          <div className="grid gap-6 sm:grid-cols-2">
            {materials.map((m, i) => (
              <Reveal key={m.name} delay={i * 80}>
                <div className="rounded-xl border border-line bg-surface p-8">
                  <div
                    className="mb-5 h-28 rounded-lg"
                    style={{ background: `linear-gradient(135deg, ${m.tint}, ${m.tint}cc)` }}
                  />
                  <h3 className="font-display text-2xl text-ink">{m.name}</h3>
                  <p className="mt-2 text-muted">{m.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

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
