"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";

export function QuickViewModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const [quantity, setQuantity] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const outOfStock = product.stock <= 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function prevImg() {
    setImgIndex((i) => (i - 1 + product.images.length) % product.images.length);
  }
  function nextImg() {
    setImgIndex((i) => (i + 1) % product.images.length);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900 md:flex-row">
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <X size={16} />
        </button>

        {/* Image section */}
        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-black/5 dark:bg-white/5 md:w-5/12">
          {product.images[imgIndex] ? (
            <Image
              src={product.images[imgIndex]!}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-black/30">
              No image
            </div>
          )}
          {product.images.length > 1 && (
            <>
              <button
                onClick={prevImg}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow transition hover:bg-white dark:bg-black/60 dark:hover:bg-black/80"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextImg}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow transition hover:bg-white dark:bg-black/60 dark:hover:bg-black/80"
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`h-1.5 w-1.5 rounded-full transition ${i === imgIndex ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Details section */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5 md:p-6">
          <div className="flex items-start justify-between gap-3 pr-6">
            <h2 className="text-lg font-bold leading-tight">{product.name}</h2>
            <button
              onClick={() => {
                toggle(product);
                toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="shrink-0 rounded-full p-1.5 transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Heart
                size={20}
                className={isWishlisted ? "fill-red-500 text-red-500" : "text-black/40 dark:text-white/40"}
              />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-black/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {outOfStock && (
              <span className="rounded-full bg-black/10 px-2.5 py-1 text-xs font-semibold dark:bg-white/10">
                Sold out
              </span>
            )}
          </div>

          <p className="line-clamp-4 text-sm text-black/60 dark:text-white/60">
            {product.description}
          </p>

          {!outOfStock && (
            <div className="flex items-center gap-3">
              <div className="flex items-center overflow-hidden rounded-lg border border-black/15 dark:border-white/20">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-base hover:bg-black/5 dark:hover:bg-white/10"
                  aria-label="Decrease"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 text-base hover:bg-black/5 disabled:opacity-40 dark:hover:bg-white/10"
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-black/40 dark:text-white/40">
                {product.stock} in stock
              </span>
            </div>
          )}

          <button
            disabled={outOfStock}
            onClick={() => {
              addItem(product, quantity);
              toast.success(`${product.name} added to cart`);
              onClose();
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-black/20"
          >
            <ShoppingCart size={16} />
            {outOfStock ? "Out of stock" : "Add to cart"}
          </button>

          <Link
            href={`/products/${product.slug}`}
            onClick={onClose}
            className="text-center text-sm font-medium text-green-600 hover:underline"
          >
            View full details →
          </Link>
        </div>
      </div>
    </div>
  );
}
