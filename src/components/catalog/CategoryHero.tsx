import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function CategoryHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-line">
      <Container className="py-16 sm:py-24">
        {eyebrow && (
          <Reveal>
            <p className="eyebrow mb-5">{eyebrow}</p>
          </Reveal>
        )}
        <Reveal delay={80}>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.02] text-ink sm:text-6xl">{title}</h1>
        </Reveal>
        {description && (
          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
