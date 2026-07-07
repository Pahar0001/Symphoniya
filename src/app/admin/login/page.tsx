"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Неверный email или пароль");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-2">
      {/* Брендовая панель */}
      <div className="relative hidden overflow-hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1200&q=80&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="font-display text-2xl">Симфония мебели</Link>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">Личный кабинет</p>
            <h1 className="mt-3 font-display text-4xl leading-tight">
              Управление каталогом,<br />заказами и заявками
            </h1>
          </div>
        </div>
      </div>

      {/* Форма входа */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={onSubmit} className="w-full max-w-sm">
          <p className="eyebrow mb-4">Вход</p>
          <h2 className="mb-8 font-display text-3xl text-ink">Личный кабинет</h2>
          <div className="grid gap-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="marat.saidov.17@mail.ru" required />
            <Input label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full" withArrow={!loading}>
              {loading ? "Входим…" : "Войти"}
            </Button>
          </div>
          <Link href="/" className="mt-8 inline-block font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-brass">
            ← На сайт
          </Link>
        </form>
      </div>
    </div>
  );
}
