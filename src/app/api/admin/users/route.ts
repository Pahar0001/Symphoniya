import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createUserSchema } from "@/lib/validators";
import { canManageUsers, assignableRoles, type Role } from "@/lib/roles";

export const runtime = "nodejs";

async function currentRole() {
  const session = await getServerSession(authOptions);
  return session?.user?.role ?? null;
}

// GET — список пользователей. POST — создать пользователя с ролью.
export async function GET() {
  const role = await currentRole();
  if (!canManageUsers(role)) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  }
  const users = await prisma.adminUser.findMany({
    select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const role = await currentRole();
  if (!canManageUsers(role)) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  }
  const parsed = createUserSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Проверьте поля" }, { status: 400 });
  }
  const { name, email, phone, password, role: newRole } = parsed.data;

  if (!assignableRoles(role).includes(newRole as Role)) {
    return NextResponse.json({ error: "Нельзя назначить эту роль" }, { status: 403 });
  }
  const normEmail = email.toLowerCase().trim();
  if (await prisma.adminUser.findUnique({ where: { email: normEmail } })) {
    return NextResponse.json({ error: "Email уже занят" }, { status: 409 });
  }

  const user = await prisma.adminUser.create({
    data: {
      name,
      email: normEmail,
      phone: phone || null,
      role: newRole,
      passwordHash: await bcrypt.hash(password, 10),
    },
    select: { id: true, name: true, email: true, role: true },
  });
  return NextResponse.json({ user }, { status: 201 });
}
