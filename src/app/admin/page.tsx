import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, orders, leads, paidAgg] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.lead.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: "paid" } }),
  ]);

  const cards = [
    { label: "Товаров в каталоге", value: products },
    { label: "Заказов", value: orders },
    { label: "Заявок (лидов)", value: leads },
    { label: "Оплачено, ₽", value: formatPrice(paidAgg._sum.totalAmount ?? 0, false) },
  ];

  return (
    <AdminShell title="Дашборд">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-wood-100 bg-surface p-6">
            <div className="text-sm text-graphite-400">{c.label}</div>
            <div className="mt-2 font-display text-3xl text-graphite-800">{c.value}</div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
