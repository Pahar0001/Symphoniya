import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// Публичное API каталога (для фильтров/поиска на клиенте).
// GET /api/catalog?category=kuhni&style=классика&q=дуб
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const style = searchParams.get("style");
  const material = searchParams.get("material");
  const q = searchParams.get("q");

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(style ? { style } : {}),
      ...(material ? { material } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { images: { orderBy: { order: "asc" } }, category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}
