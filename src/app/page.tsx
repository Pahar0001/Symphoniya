import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { HeroR100 } from "@/components/home/HeroR100";
import { HeroGallery, type Slide } from "@/components/home/HeroGallery";
import { PORTFOLIO_CATEGORIES, catLabel } from "@/lib/portfolio-categories";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await prisma.portfolioItem.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: 8,
    select: { id: true, title: true, image: true, category: true, city: true, year: true, material: true },
  });

  const slides: Slide[] = projects.map((p) => ({
    src: p.image,
    title: p.title,
    tag: [catLabel(p.category), [p.city, p.year].filter(Boolean).join(" ")].filter(Boolean).join(" · "),
  }));

  return (
    <>
      {/* ── HERO ── */}
      <HeroR100 />

      {/* ── НАПРАВЛЕНИЯ (4 ветки) ── */}
      <section className="pt-16 sm:pt-24">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PORTFOLIO_CATEGORIES.map((c, i) => (
              <Reveal key={c.slug} delay={i * 90}>
                <Link
                  href={`/portfolio?cat=${c.slug}`}
                  data-cursor="Смотреть"
                  className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden border border-line p-6"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.cover}
                    alt={c.label}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-symphony group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="relative text-white [text-shadow:0_1px_16px_rgba(0,0,0,0.55)]">
                    <h3 className="font-display text-3xl tracking-tight">{c.label}</h3>
                    <p className="mt-2 text-sm text-white/85">{c.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
                      Смотреть <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── ПРОЕКТЫ — горизонтальная сцена ── */}
      {slides.length > 0 && (
        <div id="projects" className="scroll-mt-24 pt-16 sm:pt-24">
          <HeroGallery slides={slides} />
        </div>
      )}

      {/* ── КОНТАКТ ── */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Reveal>
                <h2 className="display-lg max-w-3xl text-ink">
                  Готовы обсудить<br />ваш проект?
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-4">
              <Reveal delay={120}>
                <div className="flex flex-col gap-3">
                  <a href="tel:+79951167286" className="font-display text-3xl text-ink transition-colors hover:text-brass">
                    +7 (995) 116 72 86
                  </a>
                  <div className="mt-4">
                    <ButtonLink href="/kontakty" withArrow>Контакты и адрес</ButtonLink>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
