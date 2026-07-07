import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";

export const metadata: Metadata = { title: "О компании" };

export default function AboutPage() {
  return (
    <>
      <CategoryHero
        eyebrow="О компании"
        title="От THE WOOD к «Симфонии мебели»"
        description="Мы сменили имя, но сохранили главное — своё производство, честные материалы и внимание к деталям."
      />
      <section className="section">
        <Container className="max-w-3xl space-y-6 text-lg leading-relaxed text-graphite-600">
          <p>
            Компания начинала как <strong className="text-graphite-800">THE WOOD</strong> —
            мастерская корпусной мебели, кухонь, столов и стульев на заказ в Москве. За годы работы
            мы отточили технологию и собрали команду, которой доверяют сложные индивидуальные проекты.
          </p>
          <p>
            Ребрендинг в <strong className="text-graphite-800">«Симфонию мебели»</strong> — это
            новый уровень зрелости. Мы сфокусировались на двух направлениях, где сильнее всего:
            кухни и корпусная мебель. Спокойная, статусная эстетика вместо визуального шума.
          </p>
          <div className="grid gap-8 pt-6 sm:grid-cols-3">
            {[
              { n: "10+ лет", d: "на рынке мебели на заказ" },
              { n: "4–8 недель", d: "средний срок изготовления" },
              { n: "24 мес.", d: "гарантия на изделия" },
            ].map((x) => (
              <div key={x.n}>
                <div className="font-display text-3xl text-wood-600">{x.n}</div>
                <div className="mt-1 text-sm text-graphite-500">{x.d}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
