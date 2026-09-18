import type { SiteSettings } from "@/lib/site-config";

// Иконки соцсетей в виде «фавиконок» — фирменные плашки MAX и ВКонтакте.
// Ссылки задаются в админке (/admin/site); без ссылки иконка не выводится.

function MaxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="max-g" x1="4" y1="44" x2="44" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1FA4FF" />
          <stop offset="0.55" stopColor="#3E5BFF" />
          <stop offset="1" stopColor="#9A3BFF" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#max-g)" />
      {/* Кольцо-«пузырь» с хвостиком слева снизу */}
      <circle cx="24.5" cy="23.5" r="10.1" fill="none" stroke="#fff" strokeWidth="6.6" />
      <path fill="#fff" d="M13.4 28.6c.7 3.4-.3 6.6-2.6 8.9 3.2.4 6.3-.7 8.6-2.8l-6-6.1Z" />
    </svg>
  );
}

function VkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="12" fill="#0077FF" />
      <g transform="scale(2)">
        <path
          fill="#fff"
          d="M6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z"
        />
      </g>
    </svg>
  );
}

const ITEMS = [
  { key: "max", label: "MAX", Icon: MaxIcon },
  { key: "vk", label: "ВКонтакте", Icon: VkIcon },
] as const;

export function SocialLinks({
  socials,
  size = "md",
  className = "",
}: {
  socials: SiteSettings["socials"];
  size?: "sm" | "md";
  className?: string;
}) {
  const items = ITEMS.filter((i) => socials[i.key]);
  if (items.length === 0) return null;
  const box = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  return (
    <ul className={`flex items-center gap-2.5 ${className}`}>
      {items.map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            href={socials[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Мы в ${label}`}
            title={label}
            className="block transition-transform duration-500 ease-symphony hover:-translate-y-0.5"
          >
            <Icon className={box} />
          </a>
        </li>
      ))}
    </ul>
  );
}
