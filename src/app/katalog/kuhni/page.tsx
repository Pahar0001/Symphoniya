import type { Metadata } from "next";
import { CategoryListing } from "@/components/catalog/CategoryListing";
import type { CatalogQuery } from "@/lib/catalog";

export const metadata: Metadata = { title: "Кухни на заказ" };
export const dynamic = "force-dynamic";

export default function KuhniPage({ searchParams }: { searchParams: CatalogQuery }) {
  return (
    <CategoryListing
      slug="kuhni"
      eyebrow="Каталог · Кухни"
      description="Кухни под ваши размеры и сценарии жизни. Классика, хай-тек, модерн — в спокойной палитре."
      searchParams={searchParams}
    />
  );
}
