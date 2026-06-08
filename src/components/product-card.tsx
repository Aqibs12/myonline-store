"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const image = product.images[0];
  const outOfStock = product.stock <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white transition hover:shadow-md dark:border-white/10 dark:bg-white/5">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square w-full overflow-hidden bg-black/5 dark:bg-white/10">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-black/40">No image</div>
        )}
        {outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link href={`/products/${product.slug}`} className="line-clamp-2 text-sm font-medium hover:text-orange-600">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className="text-base font-bold">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-black/40 line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
        <button
          disabled={outOfStock}
          onClick={() => {
            addItem(product, 1);
            toast.success(`${product.name} added to cart`);
          }}
          className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-black/20"
        >
          <ShoppingCart size={16} />
          Add to cart
        </button>
      </div>
    </div>
  );
}
