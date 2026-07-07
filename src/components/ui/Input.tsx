import { cn } from "@/lib/cn";

const fieldBase =
  "w-full rounded-md border border-wood-200 bg-surface px-4 py-3 text-graphite-800 placeholder:text-graphite-300 focus:border-wood-400 focus:outline-none focus:ring-1 focus:ring-wood-400";

export function Input({
  className,
  label,
  ...rest
}: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm text-graphite-600">{label}</span>}
      <input className={cn(fieldBase, className)} {...rest} />
    </label>
  );
}

export function Textarea({
  className,
  label,
  ...rest
}: { label?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm text-graphite-600">{label}</span>}
      <textarea className={cn(fieldBase, "min-h-28 resize-y", className)} {...rest} />
    </label>
  );
}
