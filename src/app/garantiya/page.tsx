import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Гарантия и сервис",
  description:
    "Гарантия 24 месяца на изделия и фурнитуру, сервисное обслуживание и понятные условия. Как мы отвечаем за результат.",
};

const COVERAGE = [
  { t: "Изделия и сборка", d: "Отвечаем за геометрию, качество сборки и покрытий. Если что-то пошло не так по нашей вине — исправляем." },
  { t: "Фурнитура", d: "Петли, направляющие и доводчики от проверенных производителей. Механизм вышел из строя в гарантийный срок — меняем." },
  { t: "Монтаж", d: "Гарантия распространяется и на монтаж: подгонку по месту, крепёж, подключение встроенной техники." },
];

const STEPS = [
  { n: "01", t: "Обращение", d: "Напишите или позвоните, опишите проблему, по возможности приложите фото." },
  { n: "02", t: "Диагностика", d: "Разбираемся в причине — дистанционно или с выездом. Определяем, гарантийный ли это случай." },
  { n: "03", t: "Решение", d: "Ремонтируем, регулируем или меняем деталь. По гарантии — за наш счёт и в согласованный срок." },
];

export default function WarrantyPage() {
  return (
    <>
      <CategoryHero
        eyebrow="Спокойствие"
        title="Гарантия и сервис"
        description="Мы делаем мебель, чтобы она служила долго, и остаёмся на связи после монтажа."
      />
      <section className="section">
        <Container className="space-y-16">
          {/* Срок */}
          <Reveal>
            <div className="rounded-xl border border-brass/40 bg-surface-2 p-8 text-center sm:p-12">
              <div className="font-display text-5xl text-brass">24 месяца</div>
              <p className="mx-auto mt-3 max-w-xl text-muted">
                Гарантия на изделия и фурнитуру с даты монтажа. А по-человечески — если возникнет
                вопрос и позже, всё равно поможем разобраться.
              </p>
            </div>
          </Reveal>

          {/* Что покрывает */}
          <div>
            <h2 className="mb-6 font-display text-2xl text-ink sm:text-3xl">Что покрывает гарантия</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {COVERAGE.map((c, i) => (
                <Reveal key={c.t} delay={i * 90}>
                  <div className="h-full rounded-xl border border-line bg-surface p-6">
                    <h3 className="font-display text-xl text-ink">{c.t}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{c.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Как воспользоваться */}
          <div>
            <h2 className="mb-6 font-display text-2xl text-ink sm:text-3xl">Как обратиться по гарантии</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 90}>
                  <div className="h-full rounded-xl border border-line bg-surface p-6">
                    <div className="font-display text-3xl text-brass">{s.n}</div>
                    <h3 className="mt-2 font-display text-lg text-ink">{s.t}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Не гарантийные случаи — честно */}
          <div>
            <h2 className="mb-4 font-display text-2xl text-ink sm:text-3xl">Что не входит в гарантию</h2>
            <ul className="space-y-2 text-muted">
              {[
                "Механические повреждения от неаккуратной эксплуатации.",
                "Последствия неправильного ухода (абразивы, агрессивная химия, постоянная влага).",
                "Естественный износ и изменение оттенка натурального дерева со временем.",
                "Самостоятельная переделка или перенос мебели без нашего участия.",
              ].map((x) => (
                <li key={x} className="flex gap-3 leading-relaxed">
                  <span className="mt-1 text-muted">−</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              Как правильно ухаживать за разными фасадами — рассказали в гайде «Уход за фасадами».
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <ButtonLink href="/kontakty">Обратиться в сервис</ButtonLink>
            <ButtonLink href="/stati/uhod-za-fasadami" variant="outline">Гайд по уходу</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
