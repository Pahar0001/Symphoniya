import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="section">
      <Container className="max-w-xl text-center">
        <div className="font-heading text-6xl text-wood-400">404</div>
        <h1 className="mt-4 font-heading text-3xl text-graphite-800">Страница не найдена</h1>
        <p className="mt-3 text-graphite-500">Возможно, ссылка устарела или введена с ошибкой.</p>
        <div className="mt-8">
          <ButtonLink href="/">На главную</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
