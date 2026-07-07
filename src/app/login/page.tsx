"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { canAccessAdmin } from "@/lib/roles";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const justRegistered = params.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setLoading(false);
      setError("Неверный email или пароль");
      return;
    }
    const session = await getSession();
    const role = session?.user?.role;
    router.push(next ?? (canAccessAdmin(role) ? "/admin" : "/account"));
    router.refresh();
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1200&q=80&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-black/25" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="font-display text-2xl">Симфония мебели</Link>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">Аккаунт</p>
            <h1 className="mt-3 font-display text-4xl leading-tight">Вход в личный кабинет</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-paper p-6 sm:p-12">
        <form onSubmit={onSubmit} className="w-full max-w-sm">
          <p className="eyebrow mb-4">Вход</p>
          <h2 className="mb-8 font-display text-3xl text-ink">С возвращением</h2>
          {justRegistered && (
            <p className="mb-4 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink">
              Аккаунт создан. Войдите с вашими данными.
            </p>
          )}
          <div className="grid gap-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full" withArrow={!loading}>
              {loading ? "Входим…" : "Войти"}
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-brass hover:underline">Зарегистрироваться</Link>
          </p>
          <Link href="/" className="mt-6 inline-block font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-brass">
            ← На сайт
          </Link>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
