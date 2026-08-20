import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticPaths = [
    "",
    "/katalog",
    "/katalog/kuhni",
    "/katalog/shkafy",
    "/katalog/garderobnye",
    "/katalog/sanuzly",
    "/portfolio",
    "/otzyvy",
    "/fasady",
    "/uslugi",
    "/akcii",
    "/o-nas",
    "/kontakty",
    "/privacy-policy",
  ].map((p) => ({ url: `${base}${p}`, lastModified: new Date() }));

  let products: { slug: string; updatedAt: Date; category: { slug: string } }[] = [];
  try {
    products = await prisma.product.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
    });
  } catch {
    // При сборке без БД — только статические пути.
  }

  const productPaths = products.map((p) => ({
    url: `${base}/katalog/${p.category.slug}/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  return [...staticPaths, ...productPaths];
}
