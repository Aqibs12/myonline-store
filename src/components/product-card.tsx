"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { useCartDrawerStore } from "@/lib/cart-drawer-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { QuickViewModal } from "@/components/quick-view-modal";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartDrawerStore((s) => s.open);
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const [showQuickView, setShowQuickView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const image = product.images[0];
  const outOfStock = product.stock <= 0;

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white transition hover:shadow-md dark:border-white/10 dark:bg-white/5">
        {/* Image area — paddingBottom: 100% forces a reliable 1:1 square on all mobile browsers */}
        <div
          className="relative w-full overflow-hidden bg-black/5 dark:bg-white/10"
          style={{ paddingBottom: "100%" }}
        >
          {/* Product link covers entire image area */}
          <Link href={`/products/${product.slug}`} className="absolute inset-0">
            {image ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-black/10 via-black/5 to-black/10" />
                )}
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={`object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => setImageLoaded(true)}
                />
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-black/40">
                No image
              </div>
            )}
          </Link>

          {/* Favourite / heart button — top-left */}
          <button
            onClick={() => {
              toggle(product);
              toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
            }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:scale-110 dark:bg-black/60"
          >
            <Heart
              size={15}
              className={
                isWishlisted ? "fill-red-500 text-red-500" : "text-black/50 dark:text-white/60"
              }
            />
          </button>

          {/* Sold out badge — top-right */}
          {outOfStock && (
            <span className="absolute right-2 top-2 z-10 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              Sold out
            </span>
          )}

          {/* Quick view / Read more overlay — always visible on mobile, hover on desktop */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-2 bg-gradient-to-t from-black/25 to-transparent pb-4 pt-8 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
            <button
              onClick={() => setShowQuickView(true)}
              className="rounded-full bg-white px-5 py-1.5 text-sm font-semibold text-black shadow-md transition hover:bg-gray-50 active:scale-95"
            >
              Quick view
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="rounded-full bg-white px-5 py-1.5 text-sm font-semibold text-black shadow-md transition hover:bg-gray-50 active:scale-95"
            >
              Read more
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-1 p-3">
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 text-sm font-medium hover:text-teal-700"
          >
            {product.name}
          </Link>
          <div className="mt-auto flex items-center gap-2 pt-2">
            <span className="text-base font-bold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-black/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <button
            disabled={outOfStock}
            onClick={() => {
              addItem(product, 1);
              openDrawer();
            }}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-black/20"
          >
            <ShoppingCart size={16} />
            {outOfStock ? "Out of stock" : "Add to cart"}
          </button>
        </div>
      </div>

      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
}
