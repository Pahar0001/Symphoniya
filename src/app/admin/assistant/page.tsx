import { AdminShell } from "@/components/admin/AdminShell";
import { ChatPanel } from "@/components/chat/ChatPanel";

export const dynamic = "force-dynamic";

export default function AdminAssistantPage() {
  return (
    <AdminShell title="Ассистент">
      <p className="mb-6 max-w-2xl text-muted">
        Тот же ИИ-консультант, что и на сайте — здесь, в окне панели. Проверяйте ответы,
        формулировки и сценарии перед тем, как клиенты увидят их на витрине.
      </p>
      <div className="flex h-[36rem] max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-brass" />
          <span className="font-display text-lg text-ink">ИИ-консультант</span>
        </div>
        <ChatPanel className="flex-1 overflow-hidden" />
      </div>
    </AdminShell>
  );
}
