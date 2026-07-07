import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "Оформление заказа" };

export default function CheckoutPage() {
  return (
    <>
      <CategoryHero eyebrow="Заказ" title="Оформление" />
      <section className="section">
        <Container>
          <CheckoutForm />
        </Container>
      </section>
    </>
  );
}
