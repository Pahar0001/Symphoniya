import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { ServiceCard } from "@/components/checkout/ServiceCard";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Услуги" };
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });

  return (
    <>
      <CategoryHero
        eyebrow="Сервис"
        title="Цифровые услуги"
        description="Кроме самой мебели у нас есть цифровые сервисы: подробная ИИ-консультация по вашему проекту и визуализация будущего интерьера по планировке."
      />
      <section className="section">
        <Container className="grid gap-6 sm:grid-cols-2">
          {services.map((s) => (
            <ServiceCard
              key={s.id}
              slug={s.slug}
              title={s.title}
              description={s.description}
              price={s.price}
              kind={s.kind === "virtualization" ? "virtualization" : "ai_service"}
            />
          ))}
        </Container>
      </section>
    </>
  );
}
