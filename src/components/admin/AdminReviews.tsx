"use client";

import { useRouter } from "next/navigation";
import { Stars } from "@/components/reviews/Stars";

interface Row {
  id: string;
  author: string;
  city: string | null;
  rating: number;
  text: string;
  source: string;
  isPublished: boolean;
  createdAt: string;
}

export function AdminReviews({ reviews }: { reviews: Row[] }) {
  const router = useRouter();

  async function toggle(id: string, isPublished: boolean) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished }),
    });
    router.refresh();
  }
  async function remove(id: string) {
    if (!confirm("Удалить отзыв?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (reviews.length === 0) return <p className="text-muted">Отзывов пока нет.</p>;

  return (
    <div className="grid gap-4">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-xl border border-line bg-surface p-5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Stars value={r.rating} />
              <span className="text-ink">{r.author}</span>
              {r.city && <span className="text-sm text-muted">· {r.city}</span>}
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{r.source}</span>
              {!r.isPublished && (
                <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-brass">
                  на модерации
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <button onClick={() => toggle(r.id, !r.isPublished)} className="text-brass hover:underline">
                {r.isPublished ? "Снять с публикации" : "Опубликовать"}
              </button>
              <button onClick={() => remove(r.id)} className="text-red-500 hover:underline">Удалить</button>
            </div>
          </div>
          <p className="text-muted">«{r.text}»</p>
        </div>
      ))}
    </div>
  );
}
