import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

// Понятное меню разделов прямо на главной — для быстрой навигации по сайту.
const GROUPS: { title: string; links: { href: string; label: string; desc: string }[] }[] = [
  {
    title: "Каталог и заказ",
    links: [
      { href: "/katalog/kuhni", label: "Кухни", desc: "Проекты под ваше пространство" },
      { href: "/katalog/shkafy", label: "Шкафы", desc: "Распашные и купе" },
      { href: "/katalog/garderobnye", label: "Гардеробные", desc: "Хранение под потолок" },
      { href: "/katalog/sanuzly", label: "Сан-узлы", desc: "Мебель для ванной" },
      { href: "/portfolio", label: "Портфолио", desc: "Наши выполненные работы" },
      { href: "/kontakty", label: "Обсудить проект", desc: "Бесплатная консультация и смета" },
      { href: "/akcii", label: "Акции", desc: "Актуальные предложения" },
    ],
  },
  {
    title: "Помощь с выбором",
    links: [
      { href: "/fasady", label: "Фасады и материалы", desc: "Сравнение и подбор материала" },
      { href: "/stati", label: "Статьи и гайды", desc: "Как выбрать, сколько стоит, уход" },
      { href: "/uslugi", label: "Услуги", desc: "ИИ-консультация и визуализация" },
      { href: "/otzyvy", label: "Отзывы", desc: "Что говорят клиенты" },
    ],
  },
  {
    title: "О компании",
    links: [
      { href: "/o-nas", label: "О нас", desc: "Производство и принципы" },
      { href: "/garantiya", label: "Гарантия и сервис", desc: "24 месяца и поддержка" },
      { href: "/faq", label: "Вопросы и ответы", desc: "Часто спрашивают" },
      { href: "/kontakty", label: "Контакты", desc: "Адрес, телефон, почта" },
    ],
  },
];

export function HomeMenu() {
  return (
    <section className="pt-section">
      <Container>
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-5">
            <span className="eyebrow">Навигация</span>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">Разделы сайта</h2>
          </div>
        </Reveal>
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 90}>
              <div>
                <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-brass">{g.title}</div>
                <ul className="space-y-1">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="group -mx-3 flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface"
                      >
                        <span>
                          <span className="block text-ink transition-colors group-hover:text-brass">{l.label}</span>
                          <span className="block text-sm text-muted">{l.desc}</span>
                        </span>
                        <span className="shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brass">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
