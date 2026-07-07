import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CallbackForm } from "@/components/forms/CallbackForm";
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-graphite-800 text-cream-50">
        <Container className="grid gap-10 py-24 sm:py-32 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow mb-4 text-wood-300">THE WOOD → Симфония мебели</p>
            <h1 className="font-heading text-5xl leading-[1.05] sm:text-6xl">
              Мебель, в которой слышна тишина
            </h1>
            <p className="mt-6 max-w-lg text-lg text-cream-200/80">
              Кухни и корпусная мебель на заказ. Натуральные материалы, точная геометрия,
              спокойная эстетика без лишнего шума.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/katalog/kuhni" variant="primary" className="bg-wood-500 hover:bg-wood-400">
                Смотреть кухни
              </ButtonLink>
              <ButtonLink href="/katalog/korpusnaya-mebel" variant="outline" className="border-cream-200/40 text-cream-50 hover:bg-white/10">
                Корпусная мебель
              </ButtonLink>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-lg bg-graphite-700/60" />
        </Container>
      </section>

      {/* Категории */}
      <section className="section">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { href: "/katalog/kuhni", title: "Кухни", desc: "Индивидуальные проекты под ваше пространство" },
              { href: "/katalog/korpusnaya-mebel", title: "Корпусная мебель", desc: "Гардеробные, стеллажи, системы хранения" },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex flex-col justify-end rounded-lg border border-wood-100 bg-cream-100 p-10 transition hover:border-wood-300"
              >
                <h2 className="font-heading text-3xl text-graphite-800">{c.title}</h2>
                <p className="mt-2 text-graphite-500">{c.desc}</p>
                <span className="mt-6 text-sm text-wood-600 group-hover:underline">Перейти →</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Акции / витрина */}
      {promo.length > 0 && (
        <section className="section bg-cream-100">
          <Container>
            <p className="eyebrow mb-3">Специальные предложения</p>
            <h2 className="mb-10 font-heading text-4xl text-graphite-800">Акции</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {promo.map((p) => (
                <ProductCard key={p.id} product={p} categorySlug={p.category.slug} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Ценности */}
      <section className="section">
        <Container className="grid gap-10 sm:grid-cols-3">
          {[
            { t: "Своё производство", d: "Контроль качества на каждом этапе, сроки 4–8 недель." },
            { t: "Натуральные материалы", d: "Массив, шпон, эмаль — честные фактуры без имитаций." },
            { t: "Индивидуальный расчёт", d: "Проект под ваши размеры и бюджет, без шаблонов." },
          ].map((v) => (
            <div key={v.t}>
              <h3 className="font-heading text-2xl text-graphite-800">{v.t}</h3>
              <p className="mt-2 text-graphite-500">{v.d}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* Заявка */}
      <section className="section bg-cream-100">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-heading text-4xl text-graphite-800">Рассчитаем ваш проект</h2>
            <p className="mt-4 max-w-md text-graphite-500">
              Оставьте телефон — консультант перезвонит, ответит на вопросы и подготовит расчёт.
              Либо задайте вопрос ИИ-консультанту в правом нижнем углу.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
            <CallbackForm />
          </div>
        </Container>
      </section>
    </>
  );
}
