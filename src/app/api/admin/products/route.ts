import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productSchema } from "@/lib/validators";

export const runtime = "nodejs";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return Boolean(session?.user);
}

// GET — список товаров (админ). POST — создать товар.
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { order: "asc" } }, category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const parsed = productSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Проверьте поля" },
      { status: 400 }
    );
  }
  const { images, ...data } = parsed.data;
  const product = await prisma.product.create({
    data: {
      ...data,
      images: images
        ? { create: images.map((im, i) => ({ url: im.url, alt: im.alt, order: i })) }
        : undefined,
    },
    include: { images: true },
  });
  return NextResponse.json({ product }, { status: 201 });
}
