"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import type { CartItem } from "@/types";

export function AddToCartButton({ item }: { item: CartItem }) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  return (
    <Button
      variant="outline"
      onClick={() => {
        add(item);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      }}
    >
      {added ? "Добавлено ✓" : "В корзину"}
    </Button>
  );
}
