"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { listOrdersForUser } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/types";
import clsx from "clsx";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!user) return;
    listOrdersForUser(user.uid).then(setOrders);
  }, [user]);

  if (!loading && !user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-bold">Sign in to view your orders</h1>
        <Link href="/login" className="mt-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">My orders</h1>

      {orders === null ? (
        <p className="mt-6 text-sm text-black/50">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="mt-6 flex flex-col items-start gap-3">
          <p className="text-black/60 dark:text-white/60">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-black/50">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", STATUS_STYLES[order.status])}>
                  {order.status}
                </span>
              </div>
              <ul className="mt-3 flex flex-col gap-1 text-sm">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex justify-between text-black/70 dark:text-white/70">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-col gap-1 border-t border-black/10 pt-2 text-sm dark:border-white/10">
                <div className="flex justify-between text-black/70 dark:text-white/70">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-black/70 dark:text-white/70">
                  <span>Standard Shipping</span>
                  <span>{formatPrice(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total ({order.paymentMethod.toUpperCase()})</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
