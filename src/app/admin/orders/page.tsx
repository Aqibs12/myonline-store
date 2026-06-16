"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { listAllOrders, updateOrderStatus } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/types";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  async function refresh() {
    setOrders(await listAllOrders());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleStatusChange(order: Order, status: OrderStatus) {
    try {
      await updateOrderStatus(order.id, status);
      setOrders((prev) => prev?.map((o) => (o.id === order.id ? { ...o, status } : o)) ?? null);
      toast.success(`Order marked ${status}`);
    } catch (error) {
      console.error(error);
      toast.error("Could not update order status");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Orders</h2>

      {orders === null ? (
        <p className="text-sm text-black/50">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-black/50">{new Date(order.createdAt).toLocaleString()}</p>
                  <p className="mt-1 text-sm">{order.userEmail}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", STATUS_STYLES[order.status])}>
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                    className="rounded-lg border border-black/15 bg-transparent px-2 py-1.5 text-xs font-medium outline-none focus:border-green-600 dark:border-white/20"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="text-black">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-black/[0.03] p-3 text-sm dark:bg-white/5">
                  <p className="font-medium">Shipping to</p>
                  <p className="text-black/70 dark:text-white/70">{order.shippingAddress.fullName}</p>
                  <p className="text-black/70 dark:text-white/70">{order.shippingAddress.phone}</p>
                  <p className="text-black/70 dark:text-white/70">
                    {order.shippingAddress.address}, {order.shippingAddress.city}
                  </p>
                  {order.shippingAddress.notes && (
                    <p className="mt-1 text-black/50 italic">&ldquo;{order.shippingAddress.notes}&rdquo;</p>
                  )}
                </div>
                <ul className="flex flex-col gap-1 text-sm">
                  {order.items.map((item) => (
                    <li key={item.productId} className="flex justify-between text-black/70 dark:text-white/70">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                  <li className="mt-1 flex justify-between border-t border-black/10 pt-1 text-black/70 dark:border-white/10 dark:text-white/70">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </li>
                  <li className="flex justify-between text-black/70 dark:text-white/70">
                    <span>Standard Shipping</span>
                    <span>{formatPrice(order.shippingFee)}</span>
                  </li>
                  <li className="flex justify-between font-bold">
                    <span>Total ({order.paymentMethod.toUpperCase()})</span>
                    <span>{formatPrice(order.total)}</span>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
