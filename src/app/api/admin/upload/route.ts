import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

// Загрузка изображений в память сервера (bind-mount /opt/symphony/uploads → /app/public/uploads).
// Отдаётся по /uploads/<имя>. Отдельное S3 не требуется.
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};
const MAX_BYTES = 12 * 1024 * 1024; // 12 МБ

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const fd = await req.formData().catch(() => null);
  const file = fd?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не получен" }, { status: 400 });
  }

  const ext = EXT[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Только JPG, PNG, WebP, GIF или AVIF" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Файл больше 12 МБ" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const filename = `up-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");

  try {
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buf);
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить файл на сервере" }, { status: 500 });
  }

  return NextResponse.json({ url: `/uploads/${filename}` });
}
