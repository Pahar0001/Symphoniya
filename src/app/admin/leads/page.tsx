import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const SOURCE_LABEL: Record<string, string> = {
  callback_form: "форма звонка",
  ai_chat: "ИИ-чат",
  checkout: "оформление",
};

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell title="Заявки">
      <div className="overflow-x-auto rounded-lg border border-wood-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-left text-graphite-500">
            <tr>
              <th className="p-3">Дата</th>
              <th className="p-3">Имя</th>
              <th className="p-3">Телефон</th>
              <th className="p-3">Источник</th>
              <th className="p-3">Сообщение</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-graphite-400">Заявок пока нет</td></tr>
            )}
            {leads.map((l) => (
              <tr key={l.id} className="border-t border-wood-100">
                <td className="p-3 text-graphite-500">{l.createdAt.toLocaleDateString("ru-RU")}</td>
                <td className="p-3 text-graphite-800">{l.name}</td>
                <td className="p-3"><a href={`tel:${l.phone}`} className="text-wood-600">{l.phone}</a></td>
                <td className="p-3 text-graphite-500">{SOURCE_LABEL[l.source ?? ""] ?? l.source ?? "—"}</td>
                <td className="p-3 text-graphite-500">{l.message ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
