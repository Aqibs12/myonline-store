"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { listCategories } from "@/lib/categories";
import type { Category } from "@/types";

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME ?? "My Online Store";

const linkCls =
  "text-white/75 transition hover:text-white visited:text-white/75";

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    listCategories().then(setCategories);
  }, []);

  return (
    <footer className="bg-teal-700 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Col 1 — Contact + Social */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="mailto:shop@myonlinestore.pk"
                className={`flex items-center gap-2 ${linkCls}`}
              >
                <Mail size={15} className="shrink-0" />
                Email: shop@myonlinestore.pk
              </a>
              <a
                href="tel:+923000000000"
                className={`flex items-center gap-2 ${linkCls}`}
              >
                <Phone size={15} className="shrink-0" />
                Call us : +92-300-0000000
              </a>
            </div>
            <div>
              <p className="mb-2.5 text-sm font-bold text-white">Follow Us</p>
              <div className="flex gap-2">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white transition hover:bg-white/20"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white transition hover:bg-white/20"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2 — Categories */}
          <div className="flex flex-col gap-3">
            <p className="font-bold text-white">Categories</p>
            <div className="flex flex-col gap-2.5 text-sm">
              {categories.length > 0 ? (
                categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${encodeURIComponent(cat.id)}`}
                    className={`capitalize ${linkCls}`}
                  >
                    {cat.name}
                  </Link>
                ))
              ) : (
                <Link href="/products" className={linkCls}>
                  All Products
                </Link>
              )}
            </div>
          </div>

          {/* Col 3 — Customer Care */}
          <div className="flex flex-col gap-3">
            <p className="font-bold text-white">Customer Care</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/products" className={linkCls}>Search</Link>
              <Link href="/about" className={linkCls}>About Us</Link>
              <Link href="/contact" className={linkCls}>Contact Us</Link>
              <Link href="/contact" className={linkCls}>Return Policy</Link>
            </div>
          </div>

          {/* Col 4 — Information */}
          <div className="flex flex-col gap-3">
            <p className="font-bold text-white">Information</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/contact" className={linkCls}>Privacy Policy</Link>
              <Link href="/contact" className={linkCls}>Refund Policy</Link>
              <Link href="/contact" className={linkCls}>Terms of Service</Link>
            </div>
          </div>

          {/* Col 5 — Newsletter */}
          <div className="flex flex-col gap-3">
            <p className="font-bold text-white">Newsletter Signup</p>
            <p className="text-sm text-white/75">
              Subscribe to our newsletter and stay updated with the latest products and discounts
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Subscribed successfully!");
                setEmail("");
              }}
              className="flex overflow-hidden rounded-full border border-white/30 bg-white/10"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-white/50 outline-none"
              />
              <button
                type="submit"
                className="m-1 shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-white/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 text-center text-sm text-white/50">
          <p>© {new Date().getFullYear()} {STORE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
