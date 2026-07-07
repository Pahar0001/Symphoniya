import { cn } from "@/lib/cn";

// Центрирующий контейнер — единый горизонтальный ритм на всех страницах.
// Решает исходную проблему старого сайта («блоки не отцентрованы»).
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-container px-5 sm:px-8", className)}>{children}</div>
  );
}
