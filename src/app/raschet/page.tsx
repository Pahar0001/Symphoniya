import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { Calculator } from "@/components/calculator/Calculator";

export const metadata: Metadata = { title: "Расчёт персональной стоимости" };

export default function RaschetPage() {
  return (
    <>
      <CategoryHero
        eyebrow="Калькулятор"
        title="Расчёт персональной стоимости"
        description="Выберите материалы и параметры — покажем ориентир мгновенно. Бесплатно и без регистрации. Точная цена — после замера."
      />
      <section className="section">
        <Container>
          <Calculator />
        </Container>
      </section>
    </>
  );
}
