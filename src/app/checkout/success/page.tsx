import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ClearCartOnMount } from "@/components/checkout/ClearCartOnMount";

export const metadata: Metadata = { title: "Оплата принята" };

export default function SuccessPage() {
  return (
    <section className="section">
      <Container className="max-w-xl text-center">
        <ClearCartOnMount />
        <div className="mb-6 text-5xl">✓</div>
        <h1 className="font-heading text-4xl text-graphite-800">Спасибо! Оплата принята</h1>
        <p className="mt-4 text-graphite-500">
          Мы получили ваш платёж. Менеджер свяжется с вами для уточнения деталей проекта.
        </p>
        <div className="mt-8">
          <ButtonLink href="/">На главную</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
