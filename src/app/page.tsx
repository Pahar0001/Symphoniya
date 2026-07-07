import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CallbackForm } from "@/components/forms/CallbackForm";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const HERO_IMG =
  "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1400&q=80&auto=format&fit=crop";

const MATERIALS = ["Массив дуба", "Эмаль", "Шпон ореха", "Латунь", "Камень", "Стекло", "ЛДСП премиум"];

export default async function HomePage() {
  const promo = await prisma.product.findMany({
    where: { isPromo: true, isPublished: true },
    include: { images: { orderBy: { order: "asc" } }, category: true },
    take: 3,
  });

  return (
    <>
      {/* ── Hero — открываем самым характерным: материал + композиция ── */}
      <section className="relative overflow-hidden">
        <Container className="grid gap-12 pb-20 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:pb-28 lg:pt-16">
          <div>
            <Reveal>
              <p className="eyebrow mb-6">THE WOOD → Симфония мебели</p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-display text-[clamp(2.8rem,7vw,6rem)] font-medium leading-[0.98] text-ink">
                Мебель,<br />
                в которой слышна <em className="italic text-brass">тишина</em>
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-7 max-w-md text-lg leading-relaxed text-muted">
                Кухни и корпусная мебель на заказ. Натуральные материалы, точная геометрия,
                спокойная эстетика без лишнего шума.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-9 flex flex-wrap gap-4">
                <ButtonLink href="/katalog/kuhni" withArrow>Смотреть кухни</ButtonLink>
                <ButtonLink href="/katalog/korpusnaya-mebel" variant="outline">Корпусная мебель</ButtonLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO_IMG} alt="Интерьер кухни на заказ" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            </div>
            <div className="absolute -left-4 bottom-6 rounded-lg border border-line bg-paper/90 px-5 py-3 backdrop-blur">
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted">Срок</div>
              <div className="font-display text-2xl text-ink">4–8 недель</div>
            </div>
          </Reveal>
        </Container>

        {/* Бегущая строка материалов — «партитура» фактур */}
        <div className="border-y border-line py-4">
          <div className="flex overflow-hidden">
            <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
              {[...MATERIALS, ...MATERIALS].map((m, i) => (
                <span key={i} className="flex items-center gap-10 font-mono text-sm uppercase tracking-[0.2em] text-muted">
                  {m} <span className="text-brass">✳</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Movement I — направления ── */}
      <Movement num="I" title="Два направления" className="pt-section">
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { href: "/katalog/kuhni", title: "Кухни", desc: "Индивидуальные проекты под ваше пространство", img: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=900&q=80&auto=format&fit=crop" },
            { href: "/katalog/korpusnaya-mebel", title: "Корпусная мебель", desc: "Гардеробные, стеллажи, системы хранения", img: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80&auto=format&fit=crop" },
          ].map((c, i) => (
            <Reveal key={c.href} delay={i * 120}>
              <Link
                href={c.href}
                data-cursor
                className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-xl border border-line p-8"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-symphony group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative text-white">
                  <h3 className="font-display text-3xl">{c.title}</h3>
                  <p className="mt-2 max-w-xs text-sm text-white/80">{c.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
                    Смотреть <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Movement>

      {/* ── Movement II — акции ── */}
      {promo.length > 0 && (
        <Movement num="II" title="Избранное сезона" className="pt-section">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {promo.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <ProductCard product={p} categorySlug={p.category.slug} />
              </Reveal>
            ))}
          </div>
        </Movement>
      )}

      {/* ── Movement III — ценности ── */}
      <Movement num="III" title="Как мы работаем" className="pt-section">
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-3">
          {[
            { t: "Своё производство", d: "Контроль качества на каждом этапе. Сроки 4–8 недель." },
            { t: "Натуральные материалы", d: "Массив, шпон, эмаль — честные фактуры без имитаций." },
            { t: "Индивидуальный расчёт", d: "Проект под ваши размеры и бюджет, без шаблонов." },
          ].map((v, i) => (
            <Reveal key={v.t} delay={i * 100}>
              <div className="border-t border-line pt-5">
                <span className="font-mono text-xs text-brass">0{i + 1}</span>
                <h3 className="mt-3 font-display text-2xl text-ink">{v.t}</h3>
                <p className="mt-2 leading-relaxed text-muted">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Movement>

      {/* ── Заявка ── */}
      <section className="py-section">
        <Container>
          <div className="grid gap-10 overflow-hidden rounded-xl border border-line bg-surface p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="eyebrow mb-5">Расчёт проекта</p>
              <h2 className="font-display text-4xl text-ink sm:text-5xl">Обсудим ваш проект</h2>
              <p className="mt-4 max-w-md text-muted">
                Оставьте телефон — консультант перезвонит и подготовит расчёт. Либо спросите
                ИИ-консультанта в правом нижнем углу.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <CallbackForm />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}

function Movement({
  num,
  title,
  className = "",
  children,
}: {
  num: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={className}>
      <Container>
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-5">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-brass">Movement {num}</span>
            </div>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">{title}</h2>
          </div>
        </Reveal>
        {children}
      </Container>
    </section>
  );
}
