import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Оплата не прошла" };

export default function FailPage() {
  return (
    <section className="section">
      <Container className="max-w-xl text-center">
        <div className="mb-6 text-5xl text-graphite-300">×</div>
        <h1 className="font-heading text-4xl text-graphite-800">Оплата не завершена</h1>
        <p className="mt-4 text-graphite-500">
          Платёж не был завершён. Вы можете попробовать снова или связаться с нами — поможем оформить заказ.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <ButtonLink href="/checkout">Повторить оплату</ButtonLink>
          <ButtonLink href="/kontakty" variant="outline">Связаться</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
