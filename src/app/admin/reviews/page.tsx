import { AdminShell } from "@/components/admin/AdminShell";
import { AdminReviews } from "@/components/admin/AdminReviews";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: [{ isPublished: "asc" }, { createdAt: "desc" }] });
  return (
    <AdminShell title="Отзывы">
      <AdminReviews reviews={reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))} />
    </AdminShell>
  );
}
