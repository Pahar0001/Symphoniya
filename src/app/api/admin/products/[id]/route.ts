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

// PUT — обновить товар (включая замену изображений). DELETE — удалить.
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const parsed = productSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Проверьте поля" }, { status: 400 });
  }
  const { images, ...data } = parsed.data;

  const product = await prisma.$transaction(async (tx) => {
    if (images) {
      await tx.productImage.deleteMany({ where: { productId: params.id } });
      await tx.productImage.createMany({
        data: images.map((im, i) => ({ url: im.url, alt: im.alt, order: i, productId: params.id })),
      });
    }
    return tx.product.update({
      where: { id: params.id },
      data,
      include: { images: { orderBy: { order: "asc" } } },
    });
  });

  return NextResponse.json({ product });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
