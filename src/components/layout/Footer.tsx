import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-wood-100 bg-cream-100">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-heading text-xl text-graphite-800">Симфония мебели</div>
          <p className="mt-3 text-sm text-graphite-500">
            Кухни и корпусная мебель на заказ. Москва. Ранее — THE WOOD.
          </p>
        </div>
        <div>
          <div className="mb-3 text-sm font-medium text-graphite-700">Каталог</div>
          <ul className="space-y-2 text-sm text-graphite-500">
            <li><Link href="/katalog/kuhni" className="hover:text-wood-600">Кухни</Link></li>
            <li><Link href="/katalog/korpusnaya-mebel" className="hover:text-wood-600">Корпусная мебель</Link></li>
            <li><Link href="/fasady" className="hover:text-wood-600">Фасады</Link></li>
            <li><Link href="/akcii" className="hover:text-wood-600">Акции</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-medium text-graphite-700">Компания</div>
          <ul className="space-y-2 text-sm text-graphite-500">
            <li><Link href="/o-nas" className="hover:text-wood-600">О нас</Link></li>
            <li><Link href="/uslugi" className="hover:text-wood-600">Услуги</Link></li>
            <li><Link href="/kontakty" className="hover:text-wood-600">Контакты</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-wood-600">Политика конфиденциальности</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-medium text-graphite-700">Контакты</div>
          <ul className="space-y-2 text-sm text-graphite-500">
            <li>Москва</li>
            <li><a href="tel:+70000000000" className="hover:text-wood-600">+7 (000) 000-00-00</a></li>
            <li><a href="mailto:info@symphony-mebeli.ru" className="hover:text-wood-600">info@symphony-mebeli.ru</a></li>
          </ul>
        </div>
      </Container>
      <Container className="border-t border-wood-100 py-6 text-xs text-graphite-400">
        © {year} Симфония мебели. Все права защищены.
      </Container>
    </footer>
  );
}
