import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPortfolio } from "@/components/admin/AdminPortfolio";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const items = await prisma.portfolioItem.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  return (
    <AdminShell title="Портфолио">
      <AdminPortfolio
        items={items.map((i) => ({
          id: i.id, title: i.title, image: i.image, category: i.category,
          city: i.city, year: i.year, material: i.material, isPublished: i.isPublished,
        }))}
      />
    </AdminShell>
  );
}
