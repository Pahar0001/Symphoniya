import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canManageCatalog } from "@/lib/roles";
import { SETTINGS_KEY, SETTINGS_TAG, siteSettingsSchema } from "@/lib/site-settings";

export const runtime = "nodejs";

// PUT — сохранить настройки сайта (тексты и фото Hero, салоны, соцсети).
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!canManageCatalog(session?.user?.role)) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  }

  const parsed = siteSettingsSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json({ error: issue?.message ?? "Проверьте поля", path: issue?.path }, { status: 400 });
  }

  const value = parsed.data as unknown as Prisma.InputJsonValue;
  await prisma.siteSetting.upsert({
    where: { key: SETTINGS_KEY },
    update: { value },
    create: { key: SETTINGS_KEY, value },
  });

  // Настройки живут в шапке/футере каждой страницы — сбрасываем кеш целиком.
  revalidateTag(SETTINGS_TAG);
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
