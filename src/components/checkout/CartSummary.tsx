"use client";

import { useCart, formatPrice } from "@/lib/cart";

export function CartSummary({ editable = true }: { editable?: boolean }) {
  const { items, setQty, remove, total } = useCart();

  if (items.length === 0) {
    return <p className="text-graphite-500">Корзина пуста.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((i) => (
        <div
          key={i.productId}
          className="flex items-center gap-4 rounded-lg border border-wood-100 bg-white p-4"
        >
          {i.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={i.image} alt={i.title} className="h-16 w-16 rounded-md object-cover" />
          )}
          <div className="flex-1">
            <div className="text-graphite-800">{i.title}</div>
            <div className="text-sm text-wood-600">{formatPrice(i.price, false)}</div>
          </div>
          {editable ? (
            <input
              type="number"
              min={1}
              value={i.qty}
              onChange={(e) => setQty(i.productId, Number(e.target.value))}
              className="w-16 rounded-md border border-wood-200 px-2 py-1 text-center"
            />
          ) : (
            <span className="text-graphite-500">×{i.qty}</span>
          )}
          {editable && (
            <button
              onClick={() => remove(i.productId)}
              className="text-graphite-400 hover:text-red-600"
              aria-label="Удалить"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-wood-100 pt-4 text-lg">
        <span className="text-graphite-600">Итого</span>
        <span className="font-medium text-graphite-800">{formatPrice(total(), false)}</span>
      </div>
    </div>
  );
}
