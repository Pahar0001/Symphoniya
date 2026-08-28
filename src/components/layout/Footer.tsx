import Link from "next/link";
import { COMPANY_ADDRESS, COMPANY_MAP_URL } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="font-display text-2xl text-ink">Симфония мебели</div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Мебель на заказ: кухни, шкафы, гардеробные и сан-узлы. Москва и область.
          </p>
        </div>
        <FooterCol title="Каталог" links={[
          ["/katalog/kuhni", "Кухни"],
          ["/katalog/shkafy", "Шкафы"],
          ["/katalog/garderobnye", "Гардеробные"],
          ["/katalog/sanuzly", "Сан-узлы"],
          ["/portfolio", "Портфолио"],
          ["/fasady", "Фасады"],
          ["/stati", "Статьи"],
        ]} />
        <FooterCol title="Компания" links={[
          ["/o-nas", "О нас"],
          ["/uslugi", "Услуги"],
          ["/otzyvy", "Отзывы"],
          ["/garantiya", "Гарантия и сервис"],
          ["/faq", "Вопросы и ответы"],
          ["/kontakty", "Контакты"],
          ["/privacy-policy", "Политика конфиденциальности"],
        ]} />
        <div>
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">Контакты</div>
          <ul className="space-y-2.5 text-sm text-ink">
            <li>
              <a href={COMPANY_MAP_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brass">
                {COMPANY_ADDRESS} ↗
              </a>
            </li>
            <li><a href="tel:+79951167286" className="transition-colors hover:text-brass">+7 (995) 116 72 86</a></li>
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col items-start justify-between gap-2 border-t border-line py-6 font-mono text-[11px] uppercase tracking-wider text-muted sm:flex-row sm:items-center">
        <span>© {year} Симфония мебели</span>
        <a
          href="https://burbey.ru/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-brass"
        >
          Сделано командой Vanta Digital Group ↗
        </a>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">{title}</div>
      <ul className="space-y-2.5 text-sm text-ink">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="transition-colors hover:text-brass">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
