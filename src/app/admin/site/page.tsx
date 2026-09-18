import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSite } from "@/components/admin/AdminSite";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

// «Сайт» — редактирование первого экрана, контактов салонов и соцсетей без правки кода.
export default async function AdminSitePage() {
  const settings = await getSiteSettings();
  return (
    <AdminShell title="Сайт — тексты, фото и контакты">
      <AdminSite initial={settings} />
    </AdminShell>
  );
}
