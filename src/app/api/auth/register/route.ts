import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validators";

export const runtime = "nodejs";

// Регистрация клиента (роль CLIENT).
export async function POST(req: Request) {
  try {
    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Проверьте поля" },
        { status: 400 }
      );
    }
    const { name, email, phone, password } = parsed.data;
    const normEmail = email.toLowerCase().trim();

    const exists = await prisma.adminUser.findUnique({ where: { email: normEmail } });
    if (exists) {
      return NextResponse.json({ error: "Пользователь с таким email уже есть" }, { status: 409 });
    }

    await prisma.adminUser.create({
      data: {
        name,
        email: normEmail,
        phone: phone || null,
        role: "CLIENT",
        passwordHash: await bcrypt.hash(password, 10),
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("register error:", e);
    return NextResponse.json({ error: "Не удалось зарегистрировать" }, { status: 500 });
  }
}
