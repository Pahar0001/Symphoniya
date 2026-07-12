import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Вопросы и ответы",
  description:
    "Частые вопросы о заказе кухонь и корпусной мебели: сроки, оплата, замер, доставка, гарантия и материалы.",
};

const FAQ: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Заказ и сроки",
    items: [
      { q: "Сколько времени занимает изготовление?", a: "В среднем 4–8 недель с момента утверждения проекта и внесения предоплаты. Точный срок зависит от материалов и сложности — назовём его в смете." },
      { q: "С чего начать?", a: "Оставьте заявку или прикиньте бюджет в калькуляторе. Дальше приезжаем на замер, готовим 3D-проект и смету. В работу запускаем только после того, как вы всё утвердите." },
      { q: "Можно ли внести изменения после старта?", a: "Небольшие правки — да, пока не начался раскрой. После запуска в производство изменения ограничены, поэтому мы тщательно согласуем проект заранее." },
    ],
  },
  {
    group: "Цена и оплата",
    items: [
      { q: "Из чего складывается цена?", a: "Из фасадов, корпусов, столешницы, фурнитуры, техники и монтажа. Подробно разбираем это в статье «Сколько стоит кухня». Смету показываем по пунктам — без скрытых доплат." },
      { q: "Нужна ли предоплата?", a: "Да, проект запускается после предоплаты (задатка). Остаток — по этапам, финально после монтажа. Условия фиксируем в договоре." },
      { q: "Онлайн-оплата безопасна?", a: "Оплата проходит через защищённое соединение и платёжный сервис. Данные карты мы не храним." },
    ],
  },
  {
    group: "Материалы и качество",
    items: [
      { q: "Чем массив отличается от шпона и МДФ?", a: "Массив — цельное дерево, служит десятилетиями и реставрируется. Шпон — натуральный срез дерева на стабильной основе. МДФ-эмаль — крашеный фасад без кромки. Подробно — в разделе «Фасады и материалы»." },
      { q: "Даёте ли образцы материалов и цветов?", a: "Да, на замере и в переписке подбираем образцы фактур и оттенков, чтобы вы видели материал вживую, а не только на экране." },
    ],
  },
  {
    group: "Доставка и монтаж",
    items: [
      { q: "Вы сами привозите и собираете?", a: "Да, доставка и монтаж — наша зона ответственности. Собираем, выставляем по уровню, подключаем встроенную технику и убираем за собой." },
      { q: "Что нужно подготовить к монтажу?", a: "Освободить помещение, обеспечить доступ к розеткам и коммуникациям. Остальное подскажем заранее в чек-листе перед выездом бригады." },
    ],
  },
  {
    group: "Гарантия",
    items: [
      { q: "Какая гарантия на мебель?", a: "24 месяца на изделия и фурнитуру. Подробнее об условиях и сервисе — на странице «Гарантия и сервис»." },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <CategoryHero
        eyebrow="Помощь"
        title="Вопросы и ответы"
        description="Собрали то, о чём чаще всего спрашивают. Не нашли ответ — напишите нам или спросите ИИ-консультанта."
      />
      <section className="section">
        <Container className="max-w-3xl space-y-12">
          {FAQ.map((g) => (
            <div key={g.group}>
              <h2 className="mb-4 font-display text-2xl text-ink">{g.group}</h2>
              <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
                {g.items.map((it) => (
                  <details key={it.q} className="group px-5">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="font-medium">{it.q}</span>
                      <span className="shrink-0 text-brass transition-transform duration-300 group-open:rotate-45">+</span>
                    </summary>
                    <p className="pb-4 leading-relaxed text-muted">{it.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-xl border border-line bg-surface-2 p-8 text-center">
            <h2 className="font-display text-2xl text-ink">Остались вопросы?</h2>
            <p className="mx-auto mt-2 max-w-md text-muted">
              Напишите нам — подскажем по вашему проекту, срокам и бюджету.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/kontakty">Связаться</ButtonLink>
              <ButtonLink href="/raschet" variant="outline">Калькулятор</ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
