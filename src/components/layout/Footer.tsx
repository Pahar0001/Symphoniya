import Link from "next/link";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { salonMapUrl, telHref, type SiteSettings } from "@/lib/site-config";

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="font-display text-2xl text-ink">Симфония мебели</div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {settings.footerAbout}
          </p>
        </div>
        <FooterCol title="Каталог" links={[
          ["/katalog/kuhni", "Кухни"],
          ["/katalog/shkafy", "Шкафы"],
          ["/katalog/garderobnye", "Гардеробные"],
          ["/katalog/sanuzly", "Сан-узлы"],
          ["/portfolio", "Портфолио"],
          ["/fasady", "Фасады"],
        ]} />
        <FooterCol title="Компания" links={[
          ["/o-nas", "О нас"],
          ["/otzyvy", "Отзывы"],
          ["/garantiya", "Гарантия и сервис"],
          ["/faq", "Вопросы и ответы"],
          ["/kontakty", "Контакты"],
          ["/privacy-policy", "Политика конфиденциальности"],
        ]} />
        <div>
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">Контакты</div>
          <ul className="space-y-5 text-sm text-ink">
            {settings.salons.map((salon) => (
              <li key={salon.address} className="space-y-1.5">
                <a href={salonMapUrl(salon)} target="_blank" rel="noopener noreferrer" className="block transition-colors hover:text-brass">
                  {salon.address} ↗
                </a>
                <a href={telHref(salon.phone)} className="block transition-colors hover:text-brass">{salon.phone}</a>
              </li>
            ))}
          </ul>
          {settings.hours && <p className="mt-5 text-sm text-muted">{settings.hours}</p>}
          <SocialLinks socials={settings.socials} size="sm" className="mt-5" />
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
