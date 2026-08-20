import type { Metadata } from "next";
import { ProductDetail } from "@/components/catalog/ProductDetail";
import { getProduct } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.category, params.slug);
  return { title: product?.title ?? "Товар" };
}

export default function CatalogProductPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  return <ProductDetail categorySlug={params.category} productSlug={params.slug} />;
}
