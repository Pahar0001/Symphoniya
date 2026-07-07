import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-500 ease-symphony disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-14px_rgba(0,0,0,0.55)]",
  outline: "border border-line text-ink hover:border-brass hover:-translate-y-0.5",
  ghost: "px-2 text-muted hover:text-brass",
};

// Стрелка, «выезжающая» при наведении — общий микро-жест кнопок.
function Arrow() {
  return (
    <span className="inline-block translate-x-0 transition-transform duration-500 ease-symphony group-hover:translate-x-1">
      →
    </span>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  withArrow = false,
  ...rest
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  withArrow?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
      {withArrow && <Arrow />}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className,
  href,
  children,
  withArrow = false,
}: {
  variant?: Variant;
  className?: string;
  href: string;
  children: React.ReactNode;
  withArrow?: boolean;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
      {withArrow && <Arrow />}
    </Link>
  );
}
