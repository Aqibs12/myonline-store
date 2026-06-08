import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listActiveProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME ?? "My Online Store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await listActiveProducts();
  const featured = products.slice(0, 8);

  return (
    <div className="flex flex-col">
      <section className="border-b border-black/10 bg-gradient-to-b from-orange-50 to-white py-16 dark:border-white/10 dark:from-orange-950/20 dark:to-black">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{STORE_NAME}</h1>
          <p className="max-w-xl text-black/60 dark:text-white/60">
            Quality products, fair prices, delivered to your door — Cash on Delivery, JazzCash & Easypaisa accepted.
          </p>
          <Link
            href="/products"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Shop now
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Featured products</h2>
          <Link href="/products" className="text-sm font-medium text-orange-600 hover:underline">
            View all
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
