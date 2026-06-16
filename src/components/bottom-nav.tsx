"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, ShoppingCart, User, Heart } from "lucide-react";
import clsx from "clsx";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useAuth } from "@/lib/auth-context";

export function BottomNav() {
  const pathname = usePathname();
  const totalQuantity = useCartStore((s) => s.totalQuantity());
  const wishlistCount = useWishlistStore((s) => s.count());
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white dark:border-white/10 dark:bg-black md:hidden">
      <div className="grid grid-cols-4">
        {/* Shop */}
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

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={clsx(
            "flex flex-col items-center gap-1 py-3 text-xs font-medium transition",
            pathname === "/wishlist" ? "text-green-600" : "text-black/55 dark:text-white/55"
          )}
        >
          <div className="relative">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-600 px-0.5 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </div>
          Wishlist
        </Link>

        {/* Cart */}
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

        {/* Account */}
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
      </div>
    </nav>
  );
}
