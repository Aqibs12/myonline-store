"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, ShoppingCart, User, Search } from "lucide-react";
import clsx from "clsx";
import { useCartStore } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth-context";

export function BottomNav() {
  const pathname = usePathname();
  const totalQuantity = useCartStore((s) => s.totalQuantity());
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white dark:border-white/10 dark:bg-black md:hidden">
      <div className="grid grid-cols-4">
        <Link
          href="/products"
          className={clsx(
            "flex flex-col items-center gap-1 py-3 text-xs font-medium transition",
            pathname === "/products" ? "text-green-600" : "text-black/55 dark:text-white/55"
          )}
        >
          <ShoppingBag size={20} />
          Shop
        </Link>

        <Link
          href="/cart"
          className={clsx(
            "flex flex-col items-center gap-1 py-3 text-xs font-medium transition",
            pathname === "/cart" ? "text-green-600" : "text-black/55 dark:text-white/55"
          )}
        >
          <div className="relative">
            <ShoppingCart size={20} />
            {totalQuantity > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-600 px-0.5 text-[10px] font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </div>
          Cart
        </Link>

        <Link
          href={user ? "/orders" : "/login"}
          className={clsx(
            "flex flex-col items-center gap-1 py-3 text-xs font-medium transition",
            pathname === "/login" || pathname === "/orders"
              ? "text-green-600"
              : "text-black/55 dark:text-white/55"
          )}
        >
          <User size={20} />
          Account
        </Link>

        <Link
          href="/products"
          className="flex flex-col items-center gap-1 py-3 text-xs font-medium text-black/55 transition dark:text-white/55"
          aria-label="Search products"
        >
          <Search size={20} />
          Search
        </Link>
      </div>
    </nav>
  );
}
