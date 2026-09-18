import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { LocationMap } from "@/components/maps/LocationMap";
import { salonMapUrl, telHref } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Симфония мебели — мебель на заказ в Москве и области. Адреса салонов, телефоны, режим работы и схема проезда.",
};

const STEPS = [
  { n: "01", t: "Звонок или сообщение", d: "Пишете или звоните — обсуждаем задачу, сроки и бюджет." },
  { n: "02", t: "Замер", d: "Дизайнер приезжает с образцами материалов, снимает размеры, обсуждает сценарии." },
  { n: "03", t: "Проект и смета", d: "Готовим визуализацию, точную смету и сроки. Без скрытых доплат по ходу." },
];

export default async function ContactsPage() {
  const { salons, hours } = await getSiteSettings();
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
                Позвоните или напишите — обсудим задумку, материалы и сроки. Перед визитом в салон лучше позвонить.
              </p>
            </div>
          </Reveal>
        </Container>
      </header>

      {/* ── Салоны: контакты + карта ── */}
      <section className="py-16 sm:py-24">
        <Container className="space-y-16 sm:space-y-24">
          {hours && (
            <Reveal>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Режим работы салонов</div>
                <div className="mt-1.5 text-lg text-ink">{hours}</div>
              </div>
            </Reveal>
          )}
          {salons.map((salon, i) => (
            <div key={salon.address} className="grid gap-8 lg:grid-cols-2 lg:gap-20">
              <Reveal>
                <div className="space-y-6">
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass">
                    {String(i + 1).padStart(2, "0")} · {salon.title || "Салон"}
                  </div>
                  <a
                    href={telHref(salon.phone)}
                    className="block font-display text-4xl text-ink transition-colors hover:text-brass sm:text-5xl"
                  >
                    {salon.phone}
                  </a>
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Адрес</div>
                    <a
                      href={salonMapUrl(salon)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1.5 text-lg text-ink underline decoration-line underline-offset-4 transition-colors hover:text-brass hover:decoration-brass"
                    >
                      {salon.address}
                      <span aria-hidden>↗</span>
                    </a>
                  </div>
                </div>
              </Reveal>
              {typeof salon.lat === "number" && typeof salon.lon === "number" && (
                <Reveal delay={120}>
                  <LocationMap
                    lat={salon.lat}
                    lon={salon.lon}
                    address={salon.address}
                    srcOverride={i === 0 ? process.env.NEXT_PUBLIC_YANDEX_MAP_SRC : undefined}
                    className="aspect-[4/3] lg:aspect-[16/10]"
                  />
                </Reveal>
              )}
            </div>
          ))}
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
