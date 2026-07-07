import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { CallbackForm } from "@/components/forms/CallbackForm";

export const metadata: Metadata = { title: "Контакты" };

export default function ContactsPage() {
  return (
    <>
      <CategoryHero eyebrow="Контакты" title="Свяжитесь с нами" />
      <section className="section">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <div className="text-sm text-graphite-400">Адрес</div>
              <div className="text-lg text-graphite-800">Москва (шоурум по записи)</div>
            </div>
            <div>
              <div className="text-sm text-graphite-400">Телефон</div>
              <a href="tel:+70000000000" className="text-lg text-graphite-800 hover:text-wood-600">
                +7 (000) 000-00-00
              </a>
            </div>
            <div>
              <div className="text-sm text-graphite-400">Почта</div>
              <a href="mailto:info@symphony-mebeli.ru" className="text-lg text-graphite-800 hover:text-wood-600">
                info@symphony-mebeli.ru
              </a>
            </div>
            <div>
              <div className="text-sm text-graphite-400">Режим работы</div>
              <div className="text-lg text-graphite-800">Ежедневно 10:00–20:00</div>
            </div>
            <div className="aspect-[16/9] rounded-lg bg-cream-200">
              {/* Здесь встраивается Яндекс/Google карта */}
              <div className="flex h-full items-center justify-center text-graphite-300">
                Карта проезда
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-cream-100 p-6 sm:p-8">
            <h2 className="mb-6 font-display text-2xl text-graphite-800">Заказать звонок</h2>
            <CallbackForm />
          </div>
        </Container>
      </section>
    </>
  );
}
