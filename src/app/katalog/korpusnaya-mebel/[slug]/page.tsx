import type { Metadata } from "next";
import { ProductDetail } from "@/components/catalog/ProductDetail";
import { getProduct } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct("korpusnaya-mebel", params.slug);
  return { title: product?.title ?? "Корпусная мебель" };
}

export default function KorpusProductPage({ params }: { params: { slug: string } }) {
  return <ProductDetail categorySlug="korpusnaya-mebel" productSlug={params.slug} />;
}
