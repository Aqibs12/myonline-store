export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/lib/products";
import { listCategories } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import { AddToCartPanel } from "./add-to-cart-panel";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.active) {
    notFound();
  }

  const categories = await listCategories();
  const categoryName = categories.find((c) => c.id === product.categoryId)?.name ?? "Uncategorized";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black/5 dark:bg-white/10">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-black/40">No image</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((img) => (
                <div key={img} className="relative aspect-square overflow-hidden rounded-lg bg-black/5 dark:bg-white/10">
                  <Image src={img} alt={product.name} fill sizes="120px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <span className="w-fit rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium capitalize text-black/60 dark:bg-white/10 dark:text-white/60">
            {categoryName}
          </span>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-base text-black/40 line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          <p className="whitespace-pre-line text-sm text-black/70 dark:text-white/70">{product.description}</p>

          <AddToCartPanel product={product} />

          <div className="mt-4 rounded-xl border border-black/10 p-4 text-sm text-black/60 dark:border-white/10 dark:text-white/60">
            <p className="font-medium text-black dark:text-white">Delivery & payment</p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Cash on Delivery available nationwide</li>
              <li>JazzCash & Easypaisa accepted</li>
              <li>Orders are usually dispatched within 1–2 business days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
