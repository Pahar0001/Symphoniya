"use client";

import { useEffect, useState } from "react";

// Липкая мини-навигация по разделам страницы с подсветкой активного (scrollspy).
// На страницах достаточно проставить у секций id, совпадающие с items[].id.
export function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  function go(e: React.MouseEvent, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  return (
    <nav className="sticky top-20 z-30 -mx-1 mb-10 overflow-x-auto border-b border-line bg-paper/80 backdrop-blur-md">
      <div className="flex gap-1 px-1 py-2">
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            onClick={(e) => go(e, it.id)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors ${
              active === it.id ? "bg-ink text-paper" : "text-muted hover:text-ink"
            }`}
          >
            {it.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
