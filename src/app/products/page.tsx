export const dynamic = "force-dynamic";

import Link from "next/link";
import clsx from "clsx";
import { listActiveProducts } from "@/lib/products";
import { listCategories } from "@/lib/categories";
import { ProductCard } from "@/components/product-card";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([listActiveProducts(category), listCategories()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Shop all products</h1>

      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/products"
            className={clsx(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition",
              !category
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            )}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${encodeURIComponent(c.id)}`}
              className={clsx(
                "rounded-full border px-3 py-1.5 text-sm font-medium capitalize transition",
                category === c.id
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p className="mt-8 text-black/60 dark:text-white/60">No products found in this category.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
