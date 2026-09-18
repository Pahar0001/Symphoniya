"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Salon, SiteSettings } from "@/lib/site-config";

// Координаты в форме держим строками (пустое поле = «не задано»).
type SalonForm = Omit<Salon, "lat" | "lon"> & { lat: string; lon: string };
type FormState = Omit<SiteSettings, "salons"> & { salons: SalonForm[] };

const EMPTY_SALON: SalonForm = { title: "", address: "", phone: "", mapUrl: "", lat: "", lon: "" };

function toForm(s: SiteSettings): FormState {
  return {
    ...s,
    salons: s.salons.map((x) => ({
      title: x.title ?? "",
      address: x.address,
      phone: x.phone,
      mapUrl: x.mapUrl ?? "",
      lat: typeof x.lat === "number" ? String(x.lat) : "",
      lon: typeof x.lon === "number" ? String(x.lon) : "",
    })),
  };
}

function num(v: string): number | null {
  const n = Number(v.replace(",", "."));
  return v.trim() !== "" && Number.isFinite(n) ? n : null;
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-6">
      <h2 className="font-display text-xl text-ink">{title}</h2>
      {hint && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{hint}</p>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function AdminSite({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toForm(initial));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const touch = () => setSaved(false);

  const setHero = (k: keyof FormState["hero"]) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    touch();
    setForm((f) => ({ ...f, hero: { ...f.hero, [k]: e.target.value } }));
  };
  const setTop =
    (k: "hours" | "footerAbout" | "homeCtaTitle" | "projectCtaTitle") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      touch();
      setForm((f) => ({ ...f, [k]: e.target.value }));
    };
  const setSocial = (k: "max" | "vk") => (e: React.ChangeEvent<HTMLInputElement>) => {
    touch();
    setForm((f) => ({ ...f, socials: { ...f.socials, [k]: e.target.value } }));
  };
  const setSalon = (i: number, k: keyof SalonForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    touch();
    setForm((f) => ({ ...f, salons: f.salons.map((s, j) => (j === i ? { ...s, [k]: e.target.value } : s)) }));
  };
  const addSalon = () => {
    touch();
    setForm((f) => ({ ...f, salons: [...f.salons, EMPTY_SALON] }));
  };
  const removeSalon = (i: number) => {
    touch();
    setForm((f) => ({ ...f, salons: f.salons.filter((_, j) => j !== i) }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        salons: form.salons.map((s) => ({ ...s, lat: num(s.lat), lon: num(s.lon) })),
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Не удалось сохранить");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="max-w-4xl space-y-6 pb-24">
      <Section
        title="Первый экран (Hero)"
        hint="Надписи и фото в самом верху главной страницы. Фото — горизонтальное 16:9 (лучше 2560×1440), до 12 МБ: оно показывается целиком, без обрезки."
      >
        <div className="sm:col-span-2">
          <Input label="Заголовок" value={form.hero.title} onChange={setHero("title")} required maxLength={120} />
        </div>
        <div className="sm:col-span-2">
          <Input label="Строка над заголовком" value={form.hero.eyebrow} onChange={setHero("eyebrow")} maxLength={120} />
        </div>
        <div className="sm:col-span-2">
          <Textarea label="Текст под заголовком" value={form.hero.subtitle} onChange={setHero("subtitle")} maxLength={300} />
        </div>
        <div className="sm:col-span-2">
          <ImageUploader
            label="Фото первого экрана"
            value={form.hero.image}
            onChange={(u) => {
              touch();
              setForm((f) => ({ ...f, hero: { ...f.hero, image: u } }));
            }}
          />
        </div>
        <div className="sm:col-span-2">
          <Input label="Описание фото (для поисковиков и незрячих)" value={form.hero.imageAlt} onChange={setHero("imageAlt")} maxLength={200} />
        </div>
        <Input label="Главная кнопка — надпись" value={form.hero.primaryLabel} onChange={setHero("primaryLabel")} required maxLength={40} />
        <Input label="Главная кнопка — ссылка" value={form.hero.primaryHref} onChange={setHero("primaryHref")} placeholder="/kontakty" required />
        <Input label="Вторая кнопка — надпись" value={form.hero.secondaryLabel} onChange={setHero("secondaryLabel")} maxLength={40} />
        <Input label="Вторая кнопка — ссылка" value={form.hero.secondaryHref} onChange={setHero("secondaryHref")} placeholder="#projects" />
      </Section>

      <Section
        title="Салоны и контакты"
        hint="Адреса и телефоны показываются в шапке, в футере и на странице «Контакты». Первый салон — основной: его телефон стоит в призывах «позвонить»."
      >
        <div className="sm:col-span-2">
          <Input label="Режим работы" value={form.hours} onChange={setTop("hours")} maxLength={80} />
        </div>
        {form.salons.map((s, i) => (
          <fieldset key={i} className="grid gap-4 rounded-lg border border-line p-4 sm:col-span-2 sm:grid-cols-2">
            <legend className="px-2 font-mono text-[11px] uppercase tracking-widest text-muted">
              Салон {i + 1}
              {i === 0 ? " · основной" : ""}
            </legend>
            <Input label="Название" value={s.title} onChange={setSalon(i, "title")} placeholder="Салон на Тимирязевской" maxLength={80} />
            <Input label="Телефон" value={s.phone} onChange={setSalon(i, "phone")} placeholder="+7 (995) 000 00 00" required />
            <div className="sm:col-span-2">
              <Input label="Адрес" value={s.address} onChange={setSalon(i, "address")} placeholder="Москва, улица, дом" required maxLength={160} />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Ссылка на карту (необязательно — иначе строится по адресу)"
                value={s.mapUrl ?? ""}
                onChange={setSalon(i, "mapUrl")}
                placeholder="https://yandex.ru/maps/…"
              />
            </div>
            <Input label="Широта (для карты на «Контактах»)" value={s.lat} onChange={setSalon(i, "lat")} inputMode="decimal" placeholder="55.8079" />
            <Input label="Долгота" value={s.lon} onChange={setSalon(i, "lon")} inputMode="decimal" placeholder="37.5733" />
            {form.salons.length > 1 && (
              <div className="sm:col-span-2">
                <button type="button" onClick={() => removeSalon(i)} className="text-sm text-red-500 hover:underline">
                  Удалить салон
                </button>
              </div>
            )}
          </fieldset>
        ))}
        {form.salons.length < 6 && (
          <div className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={addSalon}>
              + Добавить салон
            </Button>
          </div>
        )}
      </Section>

      <Section
        title="Соцсети"
        hint="Иконки MAX и ВКонтакте стоят на странице проекта («Понравился проект?») и в футере. Пока ссылка не указана — иконка не показывается."
      >
        <Input label="MAX — ссылка" value={form.socials.max} onChange={setSocial("max")} placeholder="https://max.ru/…" />
        <Input label="ВКонтакте — ссылка" value={form.socials.vk} onChange={setSocial("vk")} placeholder="https://vk.com/…" />
      </Section>

      <Section title="Прочие надписи">
        <div className="sm:col-span-2">
          <Input label="Главная — заголовок блока с телефоном внизу" value={form.homeCtaTitle} onChange={setTop("homeCtaTitle")} required maxLength={120} />
        </div>
        <div className="sm:col-span-2">
          <Input label="Страница проекта — надпись рядом с соцсетями" value={form.projectCtaTitle} onChange={setTop("projectCtaTitle")} required maxLength={120} />
        </div>
        <div className="sm:col-span-2">
          <Textarea label="Футер — текст о компании" value={form.footerAbout} onChange={setTop("footerAbout")} maxLength={300} />
        </div>
      </Section>

      {/* Липкая панель сохранения — всегда под рукой на длинной форме. */}
      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-4 rounded-xl border border-line bg-surface/95 p-4 shadow-lg backdrop-blur">
        <Button type="submit" disabled={busy}>
          {busy ? "Сохраняем…" : "Сохранить изменения"}
        </Button>
        <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
          Открыть сайт ↗
        </a>
        <p role="status" className="text-sm">
          {error && <span className="text-red-500">{error}</span>}
          {saved && !error && <span className="text-emerald-600">Сохранено — изменения уже на сайте.</span>}
        </p>
      </div>
    </form>
  );
}
