import type { Metadata } from "next";
import { CategoryListing } from "@/components/catalog/CategoryListing";
import type { CatalogQuery } from "@/lib/catalog";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Описания веток каталога (совпадают с направлениями на сайте).
const DESCRIPTIONS: Record<string, string> = {
  kuhni: "Кухни под ваши размеры и сценарии жизни. Классика, хай-тек, модерн — в спокойной палитре.",
  shkafy: "Распашные шкафы и купе под любую нишу — по индивидуальному проекту.",
  garderobnye: "Гардеробные системы под потолок: продуманное хранение и премиальная фурнитура.",
  sanuzly: "Влагостойкая мебель для ванной комнаты и сан-узлов — на заказ по вашим размерам.",
};

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const cat = await prisma.category.findUnique({ where: { slug: params.category } });
  return { title: cat ? `${cat.title} на заказ` : "Каталог" };
}

export default function CatalogCategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: CatalogQuery;
}) {
  return (
    <CategoryListing
      slug={params.category}
      description={DESCRIPTIONS[params.category]}
      searchParams={searchParams}
    />
  );
}
