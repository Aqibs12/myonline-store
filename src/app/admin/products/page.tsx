"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import clsx from "clsx";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct, listAllProducts } from "@/lib/products";
import { listCategories } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import type { Category, Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  async function refresh() {
    const [productList, categoryList] = await Promise.all([listAllProducts(), listCategories()]);
    setProducts(productList);
    setCategories(categoryList);
  }

  function categoryName(categoryId: string): string {
    return categories.find((c) => c.id === categoryId)?.name ?? "Uncategorized";
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(product.id);
      toast.success("Product deleted");
      refresh();
    } catch (error) {
      console.error(error);
      toast.error("Could not delete product");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products</h2>
        <Link href="/admin/products/new" className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
          + Add product
        </Link>
      </div>

      {products === null ? (
        <p className="text-sm text-black/50">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">No products yet. Add your first product to start selling.</p>
      ) : (
        <div className="flex flex-col divide-y divide-black/10 overflow-hidden rounded-xl border border-black/10 dark:divide-white/10 dark:border-white/10">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-3 p-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/10">
                {product.images[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill sizes="56px" className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-black/40">No image</div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-black/50 capitalize">
                  {categoryName(product.categoryId)} · stock: {product.stock}
                </p>
              </div>
              <span className={clsx("rounded-full px-2 py-1 text-xs font-medium", product.active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-black/10 text-black/50 dark:bg-white/10")}>
                {product.active ? "Visible" : "Hidden"}
              </span>
              <span className="w-24 text-right text-sm font-semibold">{formatPrice(product.price)}</span>
              <Link
                href={`/admin/products/${product.id}`}
                className="rounded-full p-2 text-black/50 hover:bg-black/5 hover:text-green-600 dark:hover:bg-white/10"
                aria-label="Edit product"
              >
                <Pencil size={16} />
              </Link>
              <button
                onClick={() => handleDelete(product)}
                className="rounded-full p-2 text-black/50 hover:bg-black/5 hover:text-red-600 dark:hover:bg-white/10"
                aria-label="Delete product"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
