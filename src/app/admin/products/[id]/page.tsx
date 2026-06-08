"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import type { Product } from "@/types";
import { ProductForm } from "../product-form";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    getProduct(id).then(setProduct);
  }, [id]);

  if (product === undefined) {
    return <p className="text-sm text-black/50">Loading product...</p>;
  }

  if (product === null) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Edit product</h2>
      <ProductForm product={product} />
    </div>
  );
}
