import type { Category, Product, ProductImage } from "@prisma/client";

export type ProductWithImages = Product & { images: ProductImage[] };
export type CategoryWithProducts = Category & { products: ProductWithImages[] };

export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  qty: number;
  image?: string;
}

export const CATEGORY_SLUGS = ["kuhni", "korpusnaya-mebel"] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];
