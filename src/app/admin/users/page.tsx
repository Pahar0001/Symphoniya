import { getServerSession } from "next-auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assignableRoles } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const myRole = session?.user?.role ?? "MANAGER";
  const myId = session?.user?.id ?? "";

  const users = await prisma.adminUser.findMany({
    select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <AdminShell title="Пользователи" requireUsers>
      <AdminUsers
        users={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))}
        assignable={assignableRoles(myRole)}
        myId={myId}
      />
    </AdminShell>
  );
}
