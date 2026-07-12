import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CallbackForm } from "@/components/forms/CallbackForm";
import { Calculator } from "@/components/calculator/Calculator";
import { HeroMedia } from "@/components/home/HeroMedia";
import { HERO, HERO_MARQUEE } from "@/lib/site-content";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

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
                Проектируем и делаем кухни и шкафы под ваше пространство. Натуральные материалы,
                честная работа и спокойный дизайн, который не надоедает через год.
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
              <HeroMedia media={HERO.media} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            </div>
            {HERO.badge && (
              <div className="absolute -left-4 bottom-6 rounded-xl bg-black/80 px-5 py-3 shadow-lg ring-1 ring-white/10 backdrop-blur-md">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">{HERO.badge.label}</div>
                <div className="font-display text-2xl text-white">{HERO.badge.value}</div>
              </div>
            )}
          </Reveal>
        </Container>

        {/* Бегущая строка материалов — «партитура» фактур */}
        <div className="border-y border-line py-4">
          <div className="flex overflow-hidden">
            <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
              {[...HERO_MARQUEE, ...HERO_MARQUEE].map((m, i) => (
                <span key={i} className="flex items-center gap-10 font-mono text-sm uppercase tracking-[0.2em] text-muted">
                  {m} <span className="text-brass">✳</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Movement I — направления ── */}
      <Movement kicker="Каталог" title="Два направления" className="pt-section">
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { href: "/katalog/kuhni", title: "Кухни", desc: "Индивидуальные проекты под ваше пространство", img: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=900&q=80&auto=format&fit=crop" },
            { href: "/katalog/korpusnaya-mebel", title: "Корпусная мебель", desc: "Гардеробные, стеллажи, системы хранения", img: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80&auto=format&fit=crop" },
          ].map((c, i) => (
            <Reveal key={c.href} delay={i * 120}>
              <Link
                href={c.href}
                className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-xl border border-line p-8"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-symphony group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/10" />
                <div className="relative text-white [text-shadow:0_1px_16px_rgba(0,0,0,0.6)]">
                  <h3 className="font-display text-3xl">{c.title}</h3>
                  <p className="mt-2 max-w-xs text-sm text-white/85">{c.desc}</p>
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
        <Movement kicker="Акции" title="Избранное сезона" className="pt-section">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {promo.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <ProductCard product={p} categorySlug={p.category.slug} />
              </Reveal>
            ))}
          </div>
        </Movement>
      )}

      {/* ── Как мы работаем — три ценности, каждая ведёт на свою страницу ── */}
      <Movement kicker="Почему мы" title="Как мы работаем" className="pt-section">
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-3">
          {[
            { href: "/o-nas", t: "Своё производство", d: "Делаем сами — от раскроя до сборки. Отвечаем за качество на каждом этапе, средний срок — 4–8 недель.", cta: "О компании" },
            { href: "/fasady", t: "Натуральные материалы", d: "Массив, шпон, эмаль. Честные фактуры без плёнок «под дерево» — так, как выглядит настоящий материал.", cta: "Смотреть материалы" },
            { href: "/raschet", t: "Индивидуальный расчёт", d: "Считаем проект под ваши размеры, планировку и бюджет — без типовых решений и переплат.", cta: "Рассчитать стоимость" },
          ].map((v, i) => (
            <Reveal key={v.t} delay={i * 100}>
              <Link
                href={v.href}
                className="group flex h-full flex-col border-t-2 border-line pt-5 transition-colors hover:border-brass"
              >
                <span className="font-mono text-xs text-brass">0{i + 1}</span>
                <h3 className="mt-3 font-display text-2xl text-ink transition-colors group-hover:text-brass">{v.t}</h3>
                <p className="mt-2 leading-relaxed text-muted">{v.d}</p>
                <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink">
                  {v.cta}
                  <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Movement>

      {/* ── Калькулятор персональной стоимости ── */}
      <section className="pt-section">
        <Container>
          <Reveal>
            <div className="rounded-xl border border-line bg-surface p-6 sm:p-10">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
                <div>
                  <p className="eyebrow mb-3">Калькулятор</p>
                  <h2 className="font-display text-4xl text-ink sm:text-5xl">Расчёт персональной стоимости</h2>
                  <p className="mt-3 max-w-xl text-muted">
                    Подберите материалы и параметры — ориентир появится мгновенно. Бесплатно и без
                    регистрации.
                  </p>
                </div>
              </div>
              <Calculator />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Заявка ── */}
      <section className="py-section">
        <Container>
          <div className="grid gap-10 overflow-hidden rounded-xl border border-line bg-surface p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="eyebrow mb-5">Расчёт проекта</p>
              <h2 className="font-display text-4xl text-ink sm:text-5xl">Обсудим ваш проект</h2>
              <p className="mt-4 max-w-md text-muted">
                Оставьте телефон — перезвоним, обсудим задумку и подготовим расчёт. Или задайте
                вопрос ИИ-консультанту, он внизу справа.
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
  kicker,
  title,
  className = "",
  children,
}: {
  kicker: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={className}>
      <Container>
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-5">
            <span className="eyebrow">{kicker}</span>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">{title}</h2>
          </div>
        </Reveal>
        {children}
      </Container>
    </section>
  );
}
