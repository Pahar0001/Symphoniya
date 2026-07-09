"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Не удалось зарегистрироваться");
      return;
    }
    router.push("/login?registered=1");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-black/25" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="font-display text-2xl">Симфония мебели</Link>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">Аккаунт</p>
            <h1 className="mt-3 font-display text-4xl leading-tight">Создание аккаунта</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-paper p-6 sm:p-12">
        <form onSubmit={onSubmit} className="w-full max-w-sm">
          <p className="eyebrow mb-4">Регистрация</p>
          <h2 className="mb-8 font-display text-3xl text-ink">Новый аккаунт</h2>
          <div className="grid gap-4">
            <Input label="Имя" value={form.name} onChange={set("name")} required />
            <div>
              <Input label="Email" type="email" value={form.email} onChange={set("email")} required />
              <p className="mt-1.5 text-xs text-muted">
                Подойдёт корпоративная или российская почта (mail.ru, Яндекс). Регистрация с Gmail и
                других иностранных бесплатных сервисов недоступна.
              </p>
            </div>
            <Input label="Телефон (необязательно)" value={form.phone} onChange={set("phone")} />
            <Input label="Пароль" type="password" value={form.password} onChange={set("password")} required />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full" withArrow={!loading}>
              {loading ? "Создаём…" : "Зарегистрироваться"}
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-brass hover:underline">Войти</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
