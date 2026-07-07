import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";

export const metadata: Metadata = { title: "Фасады и отделка" };

const materials = [
  { name: "Массив дуба", desc: "Натуральная древесина с выраженной текстурой, ручная патина." },
  { name: "Эмаль (МДФ)", desc: "Матовые и глянцевые покрытия в приглушённых оттенках." },
  { name: "Шпон ореха", desc: "Тёплая природная фактура для акцентных поверхностей." },
  { name: "ЛДСП премиум", desc: "Практичные фактуры для систем хранения, устойчивы к износу." },
];

const finishes = ["Тёплый белый", "Песочный", "Графит", "Антрацит", "Тёмное дерево", "Олива"];

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
            {materials.map((m) => (
              <div key={m.name} className="rounded-lg border border-wood-100 bg-surface p-8">
                <div className="mb-3 h-24 rounded-md bg-cream-200" />
                <h3 className="font-heading text-2xl text-graphite-800">{m.name}</h3>
                <p className="mt-2 text-graphite-500">{m.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="mb-6 mt-16 font-heading text-3xl text-graphite-800">Палитра</h2>
          <div className="flex flex-wrap gap-4">
            {finishes.map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-full border border-wood-100 bg-surface px-4 py-2">
                <span className="h-5 w-5 rounded-full bg-wood-300" />
                <span className="text-sm text-graphite-600">{f}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
