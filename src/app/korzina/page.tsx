import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { CartSummary } from "@/components/checkout/CartSummary";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Корзина" };

export default function CartPage() {
  return (
    <>
      <CategoryHero eyebrow="Заказ" title="Корзина" />
      <section className="section">
        <Container className="max-w-2xl">
          <CartSummary />
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/checkout">Оформить заказ</ButtonLink>
            <ButtonLink href="/katalog" variant="outline">
              Продолжить выбор
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
