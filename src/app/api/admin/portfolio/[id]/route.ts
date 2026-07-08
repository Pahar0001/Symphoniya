import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { portfolioSchema } from "@/lib/validators";
import { canManageCatalog } from "@/lib/roles";

export const runtime = "nodejs";

async function allowed() {
  const s = await getServerSession(authOptions);
  return canManageCatalog(s?.user?.role);
}

// PUT — обновить работу. DELETE — удалить.
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await allowed())) return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  const parsed = portfolioSchema.partial().safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Проверьте поля" }, { status: 400 });
  const d = parsed.data;
  const item = await prisma.portfolioItem.update({
    where: { id: params.id },
    data: {
      ...(d.title !== undefined ? { title: d.title } : {}),
      ...(d.description !== undefined ? { description: d.description || null } : {}),
      ...(d.image !== undefined ? { image: d.image } : {}),
      ...(d.category !== undefined ? { category: d.category } : {}),
      ...(d.city !== undefined ? { city: d.city || null } : {}),
      ...(d.year !== undefined ? { year: d.year ?? null } : {}),
      ...(d.material !== undefined ? { material: d.material || null } : {}),
      ...(d.isPublished !== undefined ? { isPublished: d.isPublished } : {}),
    },
  });
  return NextResponse.json({ item });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await allowed())) return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  await prisma.portfolioItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
