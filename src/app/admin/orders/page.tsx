import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  pending: "ожидает",
  paid: "оплачен",
  failed: "ошибка",
  cancelled: "отменён",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell title="Заказы">
      <div className="overflow-x-auto rounded-lg border border-wood-100 bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-left text-graphite-500">
            <tr>
              <th className="p-3">Дата</th>
              <th className="p-3">Клиент</th>
              <th className="p-3">Тип</th>
              <th className="p-3">Сумма</th>
              <th className="p-3">Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-graphite-400">Заказов пока нет</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-wood-100">
                <td className="p-3 text-graphite-500">{o.createdAt.toLocaleDateString("ru-RU")}</td>
                <td className="p-3 text-graphite-800">
                  {o.customerName}
                  <div className="text-xs text-graphite-400">{o.phone}</div>
                </td>
                <td className="p-3 text-graphite-500">{o.kind}</td>
                <td className="p-3">{formatPrice(o.totalAmount, false)}</td>
                <td className="p-3">
                  <span
                    className={
                      o.status === "paid"
                        ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
                        : "rounded-full bg-cream-200 px-2 py-1 text-xs text-graphite-600"
                    }
                  >
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
