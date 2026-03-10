"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const sizes = product.sizes.split(",").map((size) => size.trim());
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "Free Size");
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      image: product.image,
      price: product.price,
      quantity: 1,
      size: selectedSize,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <select
        value={selectedSize}
        onChange={(event) => setSelectedSize(event.target.value)}
        className="rounded-full border border-[var(--color-sand)] bg-white px-4 py-3 text-sm outline-none"
      >
        {sizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleAdd}
        className="rounded-full bg-[var(--color-mocha)] px-5 py-3 text-sm font-semibold text-white"
      >
        {added ? "Added" : "Add to cart"}
      </button>
    </div>
  );
}
