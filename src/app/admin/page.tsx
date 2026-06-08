"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingBag, Clock } from "lucide-react";
import { listAllProducts } from "@/lib/products";
import { listAllOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<{ products: number; orders: number; pending: number; revenue: number } | null>(null);

  useEffect(() => {
    Promise.all([listAllProducts(), listAllOrders()]).then(([products, orders]) => {
      setStats({
        products: products.length,
        orders: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        revenue: orders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + o.total, 0),
      });
    });
  }, []);

  const cards = [
    { label: "Products", value: stats?.products, icon: Package, href: "/admin/products" },
    { label: "Orders", value: stats?.orders, icon: ShoppingBag, href: "/admin/orders" },
    { label: "Pending orders", value: stats?.pending, icon: Clock, href: "/admin/orders" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex items-center gap-3 rounded-xl border border-black/10 p-4 transition hover:shadow-md dark:border-white/10"
          >
            <div className="rounded-full bg-orange-100 p-2.5 text-orange-600 dark:bg-orange-900/30">
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-sm text-black/50">{card.label}</p>
              <p className="text-xl font-bold">{card.value ?? "—"}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
        <p className="text-sm text-black/50">Total revenue (excluding cancelled orders)</p>
        <p className="mt-1 text-2xl font-bold">{stats ? formatPrice(stats.revenue) : "—"}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700">
          + Add product
        </Link>
        <Link href="/admin/orders" className="rounded-lg border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">
          Manage orders
        </Link>
      </div>
    </div>
  );
}
