import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionNav } from "@/components/ui/SectionNav";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "«Симфония мебели» — собственное производство кухонь и корпусной мебели на заказ в Москве. Свой цех, честные материалы, полный цикл от замера до монтажа.",
};

const STEPS = [
  { n: "01", t: "Замер и бриф", d: "Приезжаем с рулеткой и лазерным уровнем. Смотрим ниши, коммуникации, окна, розетки — всё, что влияет на проект. Слушаем, как вы живёте на кухне." },
  { n: "02", t: "Проект и смета", d: "Рисуем 3D-проект и честную смету. Показываем, где можно сэкономить без потери качества, а где экономить не стоит. Правим, пока не сойдётся." },
  { n: "03", t: "Раскрой и присадка", d: "Пилим и сверлим на своём оборудовании по утверждённым чертежам. Кромим, красим, собираем корпуса. Контролируем каждую деталь до упаковки." },
  { n: "04", t: "Сборка и монтаж", d: "Привозим и собираем у вас. Выставляем по уровню, подключаем технику, подрезаем по месту. Убираем за собой." },
];

const PRINCIPLES = [
  { t: "Своё производство", d: "Мы не перепродаём чужую мебель. Всё делается в нашем цеху — значит, мы отвечаем за результат и держим сроки, а не киваем на подрядчика." },
  { t: "Честные материалы", d: "Массив — это массив, шпон — это шпон. Мы не выдаём плёнку «под дерево» за дерево и всегда говорим, из чего складывается цена." },
  { t: "Разговор, а не впаривание", d: "Задача менеджера — не продать подороже, а помочь выбрать под вашу задачу и бюджет. Иногда это значит отговорить от лишнего." },
];

export default function AboutPage() {
  return (
    <>
      <CategoryHero
        eyebrow="О компании"
        title="От THE WOOD к «Симфонии мебели»"
        description="Сменили имя, оставили суть: свой цех, честные материалы и внимание к мелочам, из которых складывается хорошая мебель."
      />

      <Container>
        <SectionNav
          items={[
            { id: "istoriya", label: "История" },
            { id: "principy", label: "Принципы" },
            { id: "process", label: "Процесс" },
            { id: "materialy", label: "Материалы" },
          ]}
        />
      </Container>

      {/* История */}
      <section id="istoriya" className="section pt-2">
        <Container className="max-w-3xl space-y-6 text-lg leading-relaxed text-muted">
          <Reveal>
            <p>
              Мы начинали как <strong className="text-ink">THE WOOD</strong> — небольшая мастерская
              в Москве, где делали кухни, шкафы, столы и стулья на заказ. Работали руками, учились на
              сложных проектах и постепенно собрали команду, которой не страшно доверить нестандартную
              задачу.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <p>
              Со временем стало ясно, где мы действительно сильны — в кухнях и корпусной мебели. Так
              появилась <strong className="text-ink">«Симфония мебели»</strong>. Мы сузили фокус,
              подтянули производство и выбрали спокойную, взрослую эстетику вместо погони за трендами.
              Мебель, которая не кричит, а служит годами и остаётся уместной.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Принципы */}
      <section id="principy" className="section pt-0">
        <Container>
          <Reveal>
            <div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-5">
              <span className="eyebrow">Во что мы верим</span>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">Три принципа</h2>
            </div>
          </Reveal>
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.t} delay={i * 100}>
                <div className="border-t-2 border-line pt-5">
                  <span className="font-mono text-xs text-brass">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-2xl text-ink">{p.t}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Как работаем — этапы */}
      <section id="process" className="section pt-0">
        <Container>
          <Reveal>
            <div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-5">
              <span className="eyebrow">Процесс</span>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">Путь проекта</h2>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="flex gap-5 rounded-xl border border-line bg-surface p-6">
                  <div className="font-display text-3xl text-brass">{s.n}</div>
                  <div>
                    <h3 className="font-display text-xl text-ink">{s.t}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Цифры */}
      <section className="section pt-0">
        <Container>
          <div className="grid gap-8 rounded-xl border border-line bg-surface-2 p-8 sm:grid-cols-3 sm:p-12">
            {[
              { n: "10+ лет", d: "делаем мебель на заказ" },
              { n: "4–8 недель", d: "средний срок от проекта до монтажа" },
              { n: "24 месяца", d: "гарантия на изделия и фурнитуру" },
            ].map((x, i) => (
              <Reveal key={x.n} delay={i * 90}>
                <div>
                  <div className="font-display text-4xl text-brass">{x.n}</div>
                  <div className="mt-1 text-sm text-muted">{x.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Материалы + CTA */}
      <section id="materialy" className="section pt-0">
        <Container>
          <div className="grid gap-8 rounded-xl border border-line bg-surface p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">Материалы, которым доверяем</h2>
              <p className="mt-4 leading-relaxed text-muted">
                Массив дуба, натуральный шпон, крашеный МДФ, влагостойкие плиты и качественная
                фурнитура. Мы честно рассказываем о плюсах и слабых местах каждого материала — чтобы
                вы платили за то, что действительно нужно.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/fasady">Разобраться в материалах</ButtonLink>
                <ButtonLink href="/portfolio" variant="outline">Наши работы</ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="rounded-xl border border-line bg-surface-2 p-6">
                <div className="font-mono text-[11px] uppercase tracking-widest text-brass">Хотите обсудить проект?</div>
                <p className="mt-2 leading-relaxed text-muted">
                  Расскажите про пространство и пожелания — подготовим проект и честную смету.
                  Или прикиньте бюджет сами в калькуляторе за пару минут.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink href="/kontakty">Связаться</ButtonLink>
                  <ButtonLink href="/raschet" variant="outline">Калькулятор</ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
