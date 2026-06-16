"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  User as UserIcon,
  Menu,
  X,
  LayoutDashboard,
  Search,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { logOut } from "@/lib/auth";
import { listCategories } from "@/lib/categories";

import type { Category } from "@/types";

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME ?? "My Online Store";

export function Navbar() {
  const { user, isOwner } = useAuth();
  const totalQuantity = useCartStore((s) => s.totalQuantity());
  const wishlistCount = useWishlistStore((s) => s.count());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "categories">("menu");
  const [categories, setCategories] = useState<Category[]>([]);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    if (drawerOpen) {
      listCategories().then(setCategories);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  function openDrawer(tab: "menu" | "categories" = "menu") {
    setActiveTab(tab);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-black/90">
        {/* ── Mobile navbar ── */}
        <div className="flex items-center justify-between px-4 py-3 md:hidden">
          <button
            onClick={() => openDrawer("menu")}
            className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <Link href="/" className="text-base font-bold tracking-tight">
            {STORE_NAME}
          </Link>

          <div className="flex items-center gap-0.5">
            <Link
              href="/products"
              className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Search"
            >
              <Search size={22} />
            </Link>
            <Link
              href="/cart"
              className="relative rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Cart"
            >
              <ShoppingCart size={22} />
              {totalQuantity > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-600 px-0.5 text-[10px] font-bold text-white">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ── Desktop navbar ── */}
        <div className="mx-auto hidden max-w-6xl items-center justify-between gap-4 px-4 py-3 md:flex">
          <Link href="/" className="text-lg font-bold tracking-tight">
            {STORE_NAME}
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-green-600">
              Home
            </Link>
            <Link href="/products" className="hover:text-green-600">
              All Products
            </Link>
            <Link href="/about" className="hover:text-green-600">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-green-600">
              Contact Us
            </Link>
            {user && (
              <Link href="/orders" className="hover:text-green-600">
                My Orders
              </Link>
            )}
            {isOwner && (
              <Link href="/admin" className="flex items-center gap-1 hover:text-green-600">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-1">
            {/* Search */}
            <Link
              href="/products"
              aria-label="Search"
              className="rounded-full p-2 transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Search size={20} />
            </Link>

            {/* Account dropdown */}
            <div className="relative" data-account-menu>
              <button
                onClick={() => setAccountOpen((o) => !o)}
                aria-label="Account"
                className="rounded-full p-2 transition hover:bg-black/5 dark:hover:bg-white/10"
              >
                <UserIcon size={20} />
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 min-w-40 overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg dark:border-white/10 dark:bg-neutral-900">
                  {user ? (
                    <>
                      <Link
                        href="/orders"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm transition hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => { logOut(); setAccountOpen(false); }}
                        className="block w-full px-4 py-2.5 text-left text-sm transition hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setAccountOpen(false)}
                      className="block px-4 py-2.5 text-sm transition hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative rounded-full p-2 transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-600 px-0.5 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative rounded-full p-2 transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              <ShoppingCart size={20} />
              {totalQuantity > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-600 px-0.5 text-[10px] font-bold text-white">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile slide-out drawer ── */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${drawerOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!drawerOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={closeDrawer}
        />

        {/* Panel */}
        <div
          className={`absolute bottom-0 left-0 top-0 flex w-[82vw] max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-neutral-950 ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Tab bar */}
          <div className="flex shrink-0 items-stretch border-b border-black/10 dark:border-white/10">
            <button
              onClick={() => setActiveTab("menu")}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition ${
                activeTab === "menu"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-black/40 dark:text-white/40"
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition ${
                activeTab === "categories"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-black/40 dark:text-white/40"
              }`}
            >
              Categories
            </button>
            <button
              onClick={closeDrawer}
              className="px-4 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "menu" ? (
              <nav className="flex flex-col">
                {[
                  { href: "/", label: "Home" },
                  { href: "/products", label: "All Products" },
                  { href: "/about", label: "About Us" },
                  { href: "/contact", label: "Contact Us" },
                ].map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={closeDrawer}
                    className="border-b border-black/5 px-5 py-4 text-sm font-medium hover:text-green-600 dark:border-white/10"
                  >
                    {item.label}
                  </Link>
                ))}
                {user && (
                  <Link
                    href="/orders"
                    onClick={closeDrawer}
                    className="border-b border-black/5 px-5 py-4 text-sm font-medium hover:text-green-600 dark:border-white/10"
                  >
                    My Orders
                  </Link>
                )}
                {isOwner && (
                  <Link
                    href="/admin"
                    onClick={closeDrawer}
                    className="flex items-center gap-2 border-b border-black/5 px-5 py-4 text-sm font-medium hover:text-green-600 dark:border-white/10"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                )}
                <div className="mt-2 border-t border-black/10 dark:border-white/10">
                  {user ? (
                    <button
                      onClick={() => {
                        closeDrawer();
                        logOut();
                      }}
                      className="w-full px-5 py-4 text-left text-sm font-medium hover:text-green-600"
                    >
                      Sign out
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={closeDrawer}
                      className="block px-5 py-4 text-sm font-medium hover:text-green-600"
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              </nav>
            ) : (
              <nav className="flex flex-col">
                {categories.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-black/40 dark:text-white/40">
                    Loading categories...
                  </p>
                ) : (
                  categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${encodeURIComponent(cat.id)}`}
                      onClick={closeDrawer}
                      className="flex items-center justify-between border-b border-black/5 px-5 py-4 text-sm font-medium capitalize hover:text-green-600 dark:border-white/10"
                    >
                      {cat.name}
                      <ChevronRight size={16} className="text-black/30 dark:text-white/30" />
                    </Link>
                  ))
                )}
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
