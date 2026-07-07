"use client";

import { useState } from "react";
import type { ProductImage } from "@prisma/client";

export function ProductGallery({ images, title }: { images: ProductImage[]; title: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-cream-200 text-graphite-300">
        Фотографии скоро появятся
      </div>
    );
  }
  return (
    <div>
      <div className="overflow-hidden rounded-lg bg-cream-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active].url}
          alt={images[active].alt ?? title}
          className="aspect-[4/3] w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((im, i) => (
            <button
              key={im.id}
              onClick={() => setActive(i)}
              className={`h-20 w-24 overflow-hidden rounded-md border ${
                i === active ? "border-wood-500" : "border-wood-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
