import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Политика конфиденциальности", robots: { index: false } };

export default function PrivacyPage() {
  return (
    <section className="section">
      <Container className="max-w-3xl space-y-5 text-graphite-600">
        <h1 className="font-display text-4xl text-graphite-800">Политика конфиденциальности</h1>
        <p className="text-sm text-graphite-400">
          Настоящая политика составлена в соответствии с Федеральным законом № 152-ФЗ
          «О персональных данных».
        </p>
        <h2 className="pt-4 font-display text-2xl text-graphite-800">1. Общие положения</h2>
        <p>
          Оператор — ООО «Симфония мебели». Обрабатываемые данные: имя, телефон, e-mail, сообщения,
          отправленные через формы сайта и ИИ-консультанта.
        </p>
        <h2 className="pt-4 font-display text-2xl text-graphite-800">2. Цели обработки</h2>
        <p>
          Обработка заявок, консультирование, оформление и исполнение заказов, обратная связь.
        </p>
        <h2 className="pt-4 font-display text-2xl text-graphite-800">3. Условия обработки</h2>
        <p>
          Данные обрабатываются с согласия субъекта, не передаются третьим лицам, кроме случаев,
          предусмотренных законом. Пользователь вправе отозвать согласие, направив запрос на
          info@symphony-mebeli.ru.
        </p>
        <p className="pt-4 text-sm text-graphite-400">
          Это шаблон. Перед публикацией замените реквизиты оператора и проверьте у юриста.
        </p>
      </Container>
    </section>
  );
}
