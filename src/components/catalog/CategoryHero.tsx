import { Container } from "@/components/ui/Container";

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
    <section className="border-b border-wood-100 bg-cream-100">
      <Container className="py-16 sm:py-20">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="max-w-3xl font-heading text-4xl text-graphite-800 sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg text-graphite-500">{description}</p>
        )}
      </Container>
    </section>
  );
}
