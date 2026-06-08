import Link from "next/link";
import clsx from "clsx";
import { listActiveProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await listActiveProducts(category);
  const allProducts = category ? await listActiveProducts() : products;
  const categories = Array.from(new Set(allProducts.map((p) => p.category))).sort();

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
                ? "border-orange-600 bg-orange-600 text-white"
                : "border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            )}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/products?category=${encodeURIComponent(c)}`}
              className={clsx(
                "rounded-full border px-3 py-1.5 text-sm font-medium capitalize transition",
                category === c
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              )}
            >
              {c}
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
