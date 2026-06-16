"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Trash2,
  ShoppingBag,
  Clipboard,
  Tag,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/lib/cart-store";
import { useCartDrawerStore } from "@/lib/cart-drawer-store";
import { formatPrice } from "@/lib/format";
import { listActiveProducts } from "@/lib/products";
import type { Product } from "@/types";

type Panel = "note" | "coupon" | null;

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const subtotalFn = useCartStore((s) => s.subtotal);
  const { isOpen, close } = useCartDrawerStore();

  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [orderNote, setOrderNote] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [suggestIdx, setSuggestIdx] = useState(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Load suggestions when drawer opens
  useEffect(() => {
    if (!isOpen) return;
    listActiveProducts().then((products) => {
      const inCart = new Set(items.map((i) => i.productId));
      const filtered = products.filter((p) => !inCart.has(p.id) && p.active);
      setSuggestions(filtered.slice(0, 5));
      setSuggestIdx(0);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function togglePanel(panel: Panel) {
    setActivePanel((p) => (p === panel ? null : panel));
  }

  const suggested = suggestions[suggestIdx];

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={close}
      />

      {/* Panel */}
      <div
        className={`absolute bottom-0 right-0 top-0 flex w-[400px] max-w-[95vw] flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-neutral-900 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* ── Header ── */}
        <div className="flex shrink-0 items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
          <h2 className="text-sm font-bold uppercase tracking-widest">Shopping Cart</h2>
          <button
            onClick={close}
            aria-label="Close cart"
            className="rounded-full p-1.5 transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
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
            <>
              {/* Cart items */}
              <ul className="divide-y divide-black/8 dark:divide-white/8">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-3 p-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-black/8 bg-black/5 dark:border-white/10 dark:bg-white/5">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-black/30">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <p className="line-clamp-2 text-sm font-medium leading-tight">{item.name}</p>
                      <p className="text-sm font-bold">{formatPrice(item.price)}</p>
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
                          <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
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

              {/* ── 3 icon buttons ── */}
              <div className="flex items-center justify-center gap-4 border-y border-black/8 py-4 dark:border-white/8">
                {[
                  { id: "note" as Panel, Icon: Clipboard, label: "Add order note" },
                  { id: "coupon" as Panel, Icon: Tag, label: "Add coupon" },
                ].map(({ id, Icon, label }) => (
                  <button
                    key={label}
                    onClick={() => id !== null && togglePanel(id)}
                    aria-label={label}
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
                      activePanel === id && id !== null
                        ? "bg-gray-200 dark:bg-white/20"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15"
                    }`}
                  >
                    <Icon size={20} className="text-black/60 dark:text-white/60" />
                  </button>
                ))}
              </div>

              {/* ── You may also like ── */}
              {suggestions.length > 0 && (
                <div className="border-b border-black/8 bg-gray-50 px-4 py-4 dark:border-white/8 dark:bg-white/5">
                  <p className="mb-3 text-center text-sm font-semibold">You may also like</p>
                  {suggested && (
                    <div className="flex items-center gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-black/8 bg-black/5">
                        {suggested.images[0] ? (
                          <Image src={suggested.images[0]} alt={suggested.name} fill sizes="64px" className="object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{suggested.name}</p>
                        <p className="text-sm text-black/60 dark:text-white/50">{formatPrice(suggested.price)}</p>
                      </div>
                      <Link
                        href={`/products/${suggested.slug}`}
                        onClick={close}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-white transition hover:bg-teal-800"
                        aria-label="View product"
                      >
                        <Eye size={16} />
                      </Link>
                    </div>
                  )}
                  {/* Carousel nav */}
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => setSuggestIdx((i) => (i - 1 + suggestions.length) % suggestions.length)}
                      className="flex h-7 w-7 items-center justify-center rounded border border-black/15 transition hover:bg-black/5 dark:border-white/20"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <div className="flex gap-1.5">
                      {suggestions.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSuggestIdx(i)}
                          className={`h-2 w-2 rounded-full transition ${i === suggestIdx ? "bg-black dark:bg-white" : "bg-black/20 dark:bg-white/20"}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setSuggestIdx((i) => (i + 1) % suggestions.length)}
                      className="flex h-7 w-7 items-center justify-center rounded border border-black/15 transition hover:bg-black/5 dark:border-white/20"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Add Order Note panel ── */}
              {activePanel === "note" && (
                <div className="px-5 py-5">
                  <h3 className="mb-3 text-base font-bold">Add Order Note</h3>
                  <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="How can we help you?"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600 dark:border-white/20 dark:bg-neutral-800"
                  />
                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        toast.success("Order note saved");
                        setActivePanel(null);
                      }}
                      className="w-full rounded-full bg-teal-700 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setOrderNote(""); setActivePanel(null); }}
                      className="w-full rounded-full border border-black/20 py-3 text-sm font-semibold transition hover:bg-black/5 dark:border-white/20"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* ── Add Coupon panel ── */}
              {activePanel === "coupon" && (
                <div className="px-5 py-5">
                  <h3 className="mb-0.5 text-base font-bold">Add A Coupon</h3>
                  <p className="mb-4 text-sm text-black/50 dark:text-white/40">
                    Coupon code will work on checkout page
                  </p>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="w-full rounded-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600 dark:border-white/20 dark:bg-neutral-800"
                  />
                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        toast.success(couponCode ? `Coupon "${couponCode}" applied` : "Enter a coupon code");
                        setActivePanel(null);
                      }}
                      className="w-full rounded-full bg-teal-700 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setCouponCode(""); setActivePanel(null); }}
                      className="w-full rounded-full border border-black/20 py-3 text-sm font-semibold transition hover:bg-black/5 dark:border-white/20"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-black/10 px-5 py-4 dark:border-white/10">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-bold">Subtotal:</span>
              <span className="font-bold">{formatPrice(subtotalFn())} PKR</span>
            </div>
            <p className="mb-4 text-xs text-black/45 dark:text-white/40">
              Taxes and shipping calculated at checkout
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/cart"
                onClick={close}
                className="block w-full rounded-full border border-black/20 py-3 text-center text-sm font-bold uppercase tracking-wider transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={close}
                className="block w-full rounded-full bg-teal-700 py-3 text-center text-sm font-bold uppercase tracking-wider text-white transition hover:bg-teal-800"
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
