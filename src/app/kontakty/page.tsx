import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { CallbackForm } from "@/components/forms/CallbackForm";
import { LocationMap } from "@/components/maps/LocationMap";

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
              <div className="text-lg text-graphite-800">Москва, Тимирязевская ул., 2/3 (шоурум по записи)</div>
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
            <LocationMap className="aspect-[16/10]" />
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
