import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { LocationMap } from "@/components/maps/LocationMap";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Симфония мебели — кухни и корпусная мебель на заказ. Москва, шоурум по записи. Телефон, почта, адрес и схема проезда.",
};

const STEPS = [
  { n: "01", t: "Звонок или сообщение", d: "Пишете или звоните — обсуждаем задачу, сроки и бюджет." },
  { n: "02", t: "Замер", d: "Дизайнер приезжает с образцами материалов, снимает размеры, обсуждает сценарии." },
  { n: "03", t: "Проект и смета", d: "Готовим визуализацию, точную смету и сроки. Без скрытых доплат по ходу." },
];

export default function ContactsPage() {
  return (
    <>
      {/* ── Заголовок ── */}
      <header className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow">Контакты</p>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <h1 className="max-w-3xl font-display text-[clamp(2.6rem,6vw,5rem)] font-medium leading-[0.98] text-ink">
                Свяжитесь с нами
              </h1>
              <p className="max-w-sm text-muted">
                Позвоните или напишите — обсудим задумку, материалы и сроки. Шоурум работает по записи.
              </p>
            </div>
          </Reveal>
        </Container>
      </header>

      {/* ── Контакты + карта ── */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-[0.5fr_0.5fr] lg:gap-20">
          <div className="space-y-10">
            <Reveal>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Телефон</div>
                <a
                  href="tel:+79951167286"
                  className="mt-2 block font-display text-4xl text-ink transition-colors hover:text-brass sm:text-5xl"
                >
                  +7 (995) 116 72 86
                </a>
              </div>
            </Reveal>

            <Reveal delay={60}>
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Режим работы</div>
                  <div className="mt-1.5 text-lg text-ink">Ежедневно, 10:00–21:00</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Адрес</div>
                  <div className="mt-1.5 text-lg text-ink">Москва, Тимирязевская ул., 2/3</div>
                  <div className="text-sm text-muted">Шоурум по записи</div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <LocationMap className="aspect-[4/3] lg:aspect-[3/4]" />
          </Reveal>
        </Container>
      </section>

      {/* ── Как это работает ── */}
      <section className="border-t border-line py-16 sm:py-24">
        <Container>
          <p className="eyebrow">Как это работает</p>
          <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="border-t-2 border-line pt-5">
                  <span className="font-mono text-sm text-brass">{s.n}</span>
                  <h3 className="mt-3 font-display text-2xl text-ink">{s.t}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
