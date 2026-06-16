"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, ShoppingCart, User, Heart } from "lucide-react";
import clsx from "clsx";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useAuth } from "@/lib/auth-context";
import { useAuthDrawerStore } from "@/lib/auth-drawer-store";

export function BottomNav() {
  const pathname = usePathname();
  const totalQuantity = useCartStore((s) => s.totalQuantity());
  const wishlistCount = useWishlistStore((s) => s.count());
  const { user } = useAuth();
  const openAuthDrawer = useAuthDrawerStore((s) => s.open);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white dark:border-white/10 dark:bg-black md:hidden">
      <div className="grid grid-cols-4">
        {/* Shop */}
        <Link
          href="/products"
          className={clsx(
            "flex flex-col items-center gap-1 py-3 text-xs font-medium transition",
            pathname === "/products" ? "text-teal-700" : "text-black/55 dark:text-white/55"
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
            pathname === "/wishlist" ? "text-teal-700" : "text-black/55 dark:text-white/55"
          )}
        >
          <div className="relative">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-700 px-0.5 text-[10px] font-bold text-white">
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
            pathname === "/cart" ? "text-teal-700" : "text-black/55 dark:text-white/55"
          )}
        >
          <div className="relative">
            <ShoppingCart size={20} />
            {totalQuantity > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-700 px-0.5 text-[10px] font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </div>
          Cart
        </Link>

        {/* Account */}
        {user ? (
          <Link
            href="/orders"
            className={clsx(
              "flex flex-col items-center gap-1 py-3 text-xs font-medium transition",
              pathname === "/orders" ? "text-teal-700" : "text-black/55 dark:text-white/55"
            )}
          >
            <User size={20} />
            Account
          </Link>
        ) : (
          <button
            onClick={() => openAuthDrawer("signin")}
            className="flex flex-col items-center gap-1 py-3 text-xs font-medium text-black/55 transition hover:text-teal-700 dark:text-white/55"
          >
            <User size={20} />
            Account
          </button>
        )}
      </div>
    </nav>
  );
}
