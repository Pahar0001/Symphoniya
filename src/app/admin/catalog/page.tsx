import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCatalog } from "@/components/admin/AdminCatalog";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminCatalogPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { images: { orderBy: { order: "asc" } }, category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <AdminShell title="Каталог">
      <AdminCatalog products={products} categories={categories} />
    </AdminShell>
  );
}
