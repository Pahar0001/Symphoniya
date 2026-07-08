import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canManageCatalog } from "@/lib/roles";

export const runtime = "nodejs";

async function allowed() {
  const s = await getServerSession(authOptions);
  return canManageCatalog(s?.user?.role);
}

// PUT — публикация/снятие с публикации. DELETE — удалить отзыв.
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await allowed())) return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const review = await prisma.review.update({
    where: { id: params.id },
    data: { isPublished: Boolean(body.isPublished) },
  });
  return NextResponse.json({ review });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await allowed())) return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  await prisma.review.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
