import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateUserSchema } from "@/lib/validators";
import { canManageUsers, assignableRoles, type Role } from "@/lib/roles";

export const runtime = "nodejs";

async function session() {
  return getServerSession(authOptions);
}

// PUT — изменить имя/роль/пароль. DELETE — удалить пользователя.
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const s = await session();
  const role = s?.user?.role ?? null;
  if (!canManageUsers(role)) return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });

  const parsed = updateUserSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Проверьте поля" }, { status: 400 });

  const target = await prisma.adminUser.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "Не найден" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (parsed.data.name) data.name = parsed.data.name;
  if (parsed.data.phone !== undefined) data.phone = parsed.data.phone || null;
  if (parsed.data.password) data.passwordHash = await bcrypt.hash(parsed.data.password, 10);

  if (parsed.data.role) {
    if (!assignableRoles(role).includes(parsed.data.role as Role)) {
      return NextResponse.json({ error: "Нельзя назначить эту роль" }, { status: 403 });
    }
    // Нельзя понизить последнего владельца.
    if (target.role === "OWNER" && parsed.data.role !== "OWNER") {
      const owners = await prisma.adminUser.count({ where: { role: "OWNER" } });
      if (owners <= 1) return NextResponse.json({ error: "Нельзя убрать последнего владельца" }, { status: 400 });
    }
    data.role = parsed.data.role;
  }

  const user = await prisma.adminUser.update({
    where: { id: params.id },
    data,
    select: { id: true, name: true, email: true, role: true },
  });
  return NextResponse.json({ user });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const s = await session();
  const role = s?.user?.role ?? null;
  if (!canManageUsers(role)) return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });

  if (s?.user?.id === params.id) {
    return NextResponse.json({ error: "Нельзя удалить самого себя" }, { status: 400 });
  }
  const target = await prisma.adminUser.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "Не найден" }, { status: 404 });
  if (target.role === "OWNER") {
    const owners = await prisma.adminUser.count({ where: { role: "OWNER" } });
    if (owners <= 1) return NextResponse.json({ error: "Нельзя удалить последнего владельца" }, { status: 400 });
  }

  await prisma.adminUser.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
