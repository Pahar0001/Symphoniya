import type { Metadata } from "next";
import { CategoryListing } from "@/components/catalog/CategoryListing";
import type { CatalogQuery } from "@/lib/catalog";

export const metadata: Metadata = { title: "Корпусная мебель на заказ" };
export const dynamic = "force-dynamic";

export default function KorpusnayaPage({ searchParams }: { searchParams: CatalogQuery }) {
  return (
    <CategoryListing
      slug="korpusnaya-mebel"
      eyebrow="Каталог · Корпусная мебель"
      description="Гардеробные, стеллажи и системы хранения по индивидуальному проекту."
      searchParams={searchParams}
    />
  );
}
