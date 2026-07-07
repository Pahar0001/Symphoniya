import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export interface CatalogQuery {
  style?: string;
  material?: string;
  sort?: string;
}

// Выборка товаров категории с учётом фильтров/сортировки — данные только из БД.
export async function getCategoryWithProducts(slug: string, q: CatalogQuery = {}) {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return null;

  const where: Prisma.ProductWhereInput = {
    categoryId: category.id,
    isPublished: true,
    ...(q.style ? { style: q.style } : {}),
    ...(q.material ? { material: q.material } : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    q.sort === "price_asc"
      ? { price: "asc" }
      : q.sort === "price_desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { images: { orderBy: { order: "asc" } } },
  });

  // Значения фильтров — из всех товаров категории.
  const all = await prisma.product.findMany({
    where: { categoryId: category.id, isPublished: true },
    select: { style: true, material: true },
  });
  const styles = [...new Set(all.map((p) => p.style).filter(Boolean))] as string[];
  const materials = [...new Set(all.map((p) => p.material).filter(Boolean))] as string[];

  return { category, products, styles, materials };
}

export async function getProduct(categorySlug: string, productSlug: string) {
  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
    include: { images: { orderBy: { order: "asc" } }, category: true },
  });
  if (!product || product.category.slug !== categorySlug || !product.isPublished) return null;
  return product;
}
