import Link from "next/link";
import { ArrowRight, Truck, RotateCcw, Shield, Headphones } from "lucide-react";
import { listActiveProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME ?? "My Online Store";

export const dynamic = "force-dynamic";

const TRUST_BADGES = [
  {
    icon: Truck,
    title: "Quick Delivery",
    desc: "Swift and easy deliveries all over Pakistan!",
  },
  {
    icon: RotateCcw,
    title: "15 Days Return",
    desc: "Simply return it within 15 days for an exchange.",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    desc: "We ensure secure payment with COD & digital wallets.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Contact us 24 hours a day, 7 days a week.",
  },
] as const;

export default async function Home() {
  const products = await listActiveProducts();
  const featured = products.slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-black/10 bg-white py-20 dark:border-white/10 dark:bg-black">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center">
          <span className="rounded-full bg-green-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-700 dark:bg-green-900/30 dark:text-green-400">
            New Arrivals Available
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{STORE_NAME}</h1>
          <p className="max-w-xl text-black/60 dark:text-white/60">
            Quality products, fair prices, delivered to your door — Cash on Delivery, JazzCash &amp; Easypaisa accepted.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Shop now
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-semibold transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-black/10 bg-gray-50 dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <Icon size={22} />
                </div>
                <span className="text-sm font-semibold">{title}</span>
                <span className="text-xs text-black/55 dark:text-white/50">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <p className="mt-1 text-sm text-black/50 dark:text-white/40">
              Freshly stocked — grab them before they&apos;re gone.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:underline"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-black/60 dark:text-white/60">
            No products yet — check back soon, or sign in as the store owner to add your first product.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
