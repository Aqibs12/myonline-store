"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-black/60 dark:text-white/60">Browse our products and add something you like.</p>
        <Link href="/products" className="mt-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">Your cart</h1>

      <div className="mt-6 flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-black/10 p-3 dark:border-white/10 sm:flex-nowrap"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/10">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-black/40">No image</div>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-sm text-black/60 dark:text-white/60">{formatPrice(item.price)}</span>
            </div>
            <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(item.productId, item.quantity - 1)}
                  className="rounded-full border border-black/15 p-1.5 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => setQuantity(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="rounded-full border border-black/15 p-1.5 hover:bg-black/5 disabled:opacity-40 dark:border-white/20 dark:hover:bg-white/10"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-right text-sm font-semibold sm:w-24">{formatPrice(item.price * item.quantity)}</span>
              <button
                onClick={() => removeItem(item.productId)}
                className="rounded-full p-2 text-black/40 hover:bg-black/5 hover:text-red-600 dark:hover:bg-white/10"
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-2 border-t border-black/10 pt-6 dark:border-white/10">
        <div className="flex w-full max-w-xs items-center justify-between text-sm text-black/60 dark:text-white/60">
          <span>Subtotal</span>
          <span className="text-base font-bold text-black dark:text-white">{formatPrice(subtotal)}</span>
        </div>
        <p className="text-xs text-black/40">Shipping & payment options shown at checkout.</p>
        <Link
          href="/checkout"
          className="mt-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
