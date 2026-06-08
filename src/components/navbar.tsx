"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, User as UserIcon, Menu, X, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCartStore } from "@/lib/cart-store";
import { logOut } from "@/lib/auth";

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME ?? "My Online Store";

export function Navbar() {
  const { user, isOwner } = useAuth();
  const totalQuantity = useCartStore((s) => s.totalQuantity());
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-black/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {STORE_NAME}
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/" className="hover:text-orange-600">
            Home
          </Link>
          <Link href="/products" className="hover:text-orange-600">
            Shop
          </Link>
          {user && (
            <Link href="/orders" className="hover:text-orange-600">
              My Orders
            </Link>
          )}
          {isOwner && (
            <Link href="/admin" className="flex items-center gap-1 hover:text-orange-600">
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10">
            <ShoppingCart size={20} />
            {totalQuantity > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-xs font-semibold text-white">
                {totalQuantity}
              </span>
            )}
          </Link>

          {user ? (
            <button
              onClick={() => logOut()}
              className="hidden items-center gap-1 rounded-full border border-black/10 px-3 py-1.5 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10 sm:flex"
            >
              <UserIcon size={16} />
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden items-center gap-1 rounded-full bg-orange-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-700 sm:flex"
            >
              <UserIcon size={16} />
              Sign in
            </Link>
          )}

          <button
            className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-black/10 px-4 py-3 text-sm font-medium dark:border-white/10 md:hidden">
          <Link href="/" className="rounded px-2 py-2 hover:bg-black/5 dark:hover:bg-white/10" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/products" className="rounded px-2 py-2 hover:bg-black/5 dark:hover:bg-white/10" onClick={() => setOpen(false)}>
            Shop
          </Link>
          {user && (
            <Link href="/orders" className="rounded px-2 py-2 hover:bg-black/5 dark:hover:bg-white/10" onClick={() => setOpen(false)}>
              My Orders
            </Link>
          )}
          {isOwner && (
            <Link href="/admin" className="rounded px-2 py-2 hover:bg-black/5 dark:hover:bg-white/10" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
          )}
          {user ? (
            <button
              onClick={() => {
                setOpen(false);
                logOut();
              }}
              className="rounded px-2 py-2 text-left hover:bg-black/5 dark:hover:bg-white/10"
            >
              Sign out
            </button>
          ) : (
            <Link href="/login" className="rounded px-2 py-2 hover:bg-black/5 dark:hover:bg-white/10" onClick={() => setOpen(false)}>
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
