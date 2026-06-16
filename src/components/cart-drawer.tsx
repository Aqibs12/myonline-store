"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useCartDrawerStore } from "@/lib/cart-drawer-store";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const subtotalFn = useCartStore((s) => s.subtotal);
  const { isOpen, close } = useCartDrawerStore();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={close}
      />

      {/* Panel */}
      <div
        className={`absolute bottom-0 right-0 top-0 flex w-[380px] max-w-[95vw] flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-neutral-900 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
          <h2 className="text-sm font-bold uppercase tracking-widest">Shopping Cart</h2>
          <button
            onClick={close}
            aria-label="Close cart"
            className="rounded-full p-1.5 transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <ShoppingBag size={44} className="text-black/15 dark:text-white/15" />
              <p className="text-sm text-black/50 dark:text-white/40">Your cart is empty</p>
              <button
                onClick={close}
                className="rounded-full bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-black/8 dark:divide-white/8">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 p-4">
                  {/* Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-black/8 bg-black/5 dark:border-white/10 dark:bg-white/5">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-black/30">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                    <p className="line-clamp-2 text-sm font-medium leading-tight">{item.name}</p>
                    <p className="text-sm font-bold">{formatPrice(item.price)}</p>

                    {/* Qty stepper + delete */}
                    <div className="flex items-center gap-3 pt-0.5">
                      <div className="flex items-center overflow-hidden rounded-full border border-black/20 dark:border-white/20">
                        <button
                          onClick={() =>
                            item.quantity <= 1
                              ? removeItem(item.productId)
                              : setQuantity(item.productId, item.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center text-base transition hover:bg-black/5 dark:hover:bg-white/10"
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="flex h-7 w-7 items-center justify-center text-base transition hover:bg-black/5 disabled:opacity-40 dark:hover:bg-white/10"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label="Remove item"
                        className="text-black/30 transition hover:text-red-500 dark:text-white/30 dark:hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-black/10 px-5 py-4 dark:border-white/10">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-bold">Subtotal:</span>
              <span className="text-sm font-bold">{formatPrice(subtotalFn())} PKR</span>
            </div>
            <p className="mb-4 text-xs text-black/45 dark:text-white/40">
              Taxes and shipping calculated at checkout
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/cart"
                onClick={close}
                className="block w-full rounded border border-black/20 py-3 text-center text-sm font-bold uppercase tracking-wider transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={close}
                className="block w-full rounded bg-teal-700 py-3 text-center text-sm font-bold uppercase tracking-wider text-white transition hover:bg-teal-800"
              >
                Check Out
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
