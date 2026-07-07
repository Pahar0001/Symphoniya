import type { Metadata } from "next";
import { ProductDetail } from "@/components/catalog/ProductDetail";
import { getProduct } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct("kuhni", params.slug);
  return { title: product?.title ?? "Кухня" };
}

export default function KuhnyaPage({ params }: { params: { slug: string } }) {
  return <ProductDetail categorySlug="kuhni" productSlug={params.slug} />;
}
