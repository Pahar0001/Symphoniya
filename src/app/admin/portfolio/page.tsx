import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPortfolio } from "@/components/admin/AdminPortfolio";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// «Портфолио» — проекты, которые показываются на главной странице.
export default async function AdminPortfolioPage() {
  const items = await prisma.portfolioItem.findMany({
    where: { onHome: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return (
    <AdminShell title="Портфолио — на главной">
      <AdminPortfolio
        scope="home"
        items={items.map((i) => ({
          id: i.id,
          title: i.title,
          image: i.image,
          category: i.category,
          city: i.city,
          year: i.year,
          material: i.material,
          complex: i.complex,
          onHome: i.onHome,
          gallery: i.gallery,
          isPublished: i.isPublished,
          description: i.description,
        }))}
      />
    </AdminShell>
  );
}
