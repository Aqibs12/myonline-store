"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/wishlist-store";
import { ProductCard } from "@/components/product-card";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-black/50">Loading...</div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">My Wishlist</h1>
      <p className="mt-1 text-sm text-black/50 dark:text-white/40">
        {items.length} {items.length === 1 ? "item" : "items"} saved
      </p>

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/5 dark:bg-white/10">
            <Heart size={36} className="text-black/20 dark:text-white/20" />
          </div>
          <p className="text-black/60 dark:text-white/60">
            You haven&apos;t saved any products yet.
          </p>
          <Link
            href="/products"
            className="rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
