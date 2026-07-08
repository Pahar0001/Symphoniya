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

// POST — добавить работу в портфолио.
export async function POST(req: Request) {
  if (!(await allowed())) return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  const parsed = portfolioSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Проверьте поля" }, { status: 400 });
  }
  const d = parsed.data;
  const item = await prisma.portfolioItem.create({
    data: {
      title: d.title,
      description: d.description || null,
      image: d.image,
      category: d.category,
      city: d.city || null,
      year: d.year ?? null,
      material: d.material || null,
      order: d.order ?? 0,
      isPublished: d.isPublished ?? true,
    },
  });
  return NextResponse.json({ item }, { status: 201 });
}
