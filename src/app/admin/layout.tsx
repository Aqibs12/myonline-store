"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isOwner } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-black/50">Loading...</div>;
  }

  if (!user || !isOwner) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-bold">Owner access only</h1>
        <p className="text-black/60 dark:text-white/60">
          This dashboard is restricted to the store owner. Sign in with the owner account to manage products and orders.
        </p>
        <Link href="/login" className="mt-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Seller dashboard</h1>
      <nav className="mt-4 flex gap-2 border-b border-black/10 pb-3 dark:border-white/10">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "rounded-full px-3 py-1.5 text-sm font-medium transition",
              pathname === item.href
                ? "bg-orange-600 text-white"
                : "text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
