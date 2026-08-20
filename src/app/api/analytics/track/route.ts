import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { recordEvent, deviceFromUA, refHost, type EventType } from "@/lib/analytics";

export const runtime = "nodejs";

const ALLOWED: EventType[] = [
  "page_view",
  "product_view",
  "project_view",
  "cta_click",
  "scroll",
  "horizontal_enter",
  "visualization",
];
const COOKIE = "sym_sid";

// Приём событий аналитики от клиента. Анонимно, без PII.
export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    // sendBeacon может прислать text/plain — пробуем как текст.
    try {
      body = JSON.parse(await req.text());
    } catch {
      body = {};
    }
  }

  const type = String(body.type ?? "") as EventType;
  if (!ALLOWED.includes(type)) {
    return NextResponse.json({ ok: false }, { status: 204 });
  }

  // Сессия: читаем first-party cookie, при отсутствии — заводим новую.
  const cookieHeader = req.headers.get("cookie") ?? "";
  const existing = cookieHeader.match(new RegExp(`${COOKIE}=([^;]+)`))?.[1];
  const session = existing ?? randomUUID();

  const ua = req.headers.get("user-agent");
  const selfHost = (() => {
    try {
      return new URL(req.url).hostname;
    } catch {
      return undefined;
    }
  })();

  await recordEvent({
    type,
    path: typeof body.path === "string" ? body.path : "/",
    referrer: refHost(typeof body.referrer === "string" ? body.referrer : null, selfHost),
    device: deviceFromUA(ua),
    session,
    meta: (body.meta as Record<string, unknown>) ?? null,
  });

  const res = NextResponse.json({ ok: true });
  if (!existing) {
    res.cookies.set(COOKIE, session, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // год
    });
  }
  return res;
}
