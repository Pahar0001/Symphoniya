import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPortfolio } from "@/components/admin/AdminPortfolio";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// «Каталог» — управление ВСЕМИ проектами сайта (страница /portfolio).
export default async function AdminCatalogPage() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return (
    <AdminShell title="Каталог — все проекты">
      <AdminPortfolio
        scope="all"
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
