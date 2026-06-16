"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { useCartStore } from "@/lib/cart-store";
import { useCartDrawerStore } from "@/lib/cart-drawer-store";

export function AddToCartPanel({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartDrawerStore((s) => s.open);
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stock <= 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-lg border border-black/15 px-2 py-1.5 dark:border-white/20">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          disabled={quantity >= product.stock}
          className="rounded-full p-1.5 hover:bg-black/5 disabled:opacity-40 dark:hover:bg-white/10"
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>
      <button
        disabled={outOfStock}
        onClick={() => {
          addItem(product, quantity);
          openDrawer();
        }}
        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-black/20"
      >
        <ShoppingCart size={16} />
        {outOfStock ? "Out of stock" : "Add to cart"}
      </button>
    </div>
  );
}
