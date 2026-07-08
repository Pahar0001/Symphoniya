import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";
import { ButtonLink } from "@/components/ui/Button";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Портфолио — наши работы" };
export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const items = await prisma.portfolioItem.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <CategoryHero
        eyebrow="Портфолио"
        title="Проекты, которые уже живут"
        description="Кухни и корпусная мебель, которые мы изготовили и установили. Каждый проект — под конкретное пространство и сценарий жизни."
      />
      <section className="section">
        <Container>
          <PortfolioGallery items={items} />
          <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-line pt-10">
            <p className="font-display text-2xl text-ink">Хотите так же?</p>
            <ButtonLink href="/kontakty" withArrow>Обсудить проект</ButtonLink>
            <ButtonLink href="/raschet" variant="outline">Рассчитать стоимость</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
