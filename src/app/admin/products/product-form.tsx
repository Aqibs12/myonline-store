"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";
import type { Category, Product, ProductInput } from "@/types";
import { createProduct, updateProduct } from "@/lib/products";
import { listCategories } from "@/lib/categories";
import { slugify } from "@/lib/format";
import { INPUT_CLASS } from "@/lib/ui";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compareAtPrice?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [stock, setStock] = useState(product?.stock?.toString() ?? "");
  const [active, setActive] = useState(product?.active ?? true);
  const [images, setImages] = useState<string[]>(
    product?.images.length ? product.images.slice(0, 3) : [""]
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listCategories().then((list) => {
      setCategories(list);
      setCategoryId((current) => current || list[0]?.id || "");
    });
  }, []);

  function updateImageUrl(index: number, url: string) {
    setImages((prev) => prev.map((u, i) => (i === index ? url : u)));
  }

  function addImageField() {
    setImages((prev) => (prev.length < 3 ? [...prev, ""] : prev));
  }

  function removeImageField(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const input: ProductInput = {
        name: name.trim(),
        slug: slugify(name),
        description: description.trim(),
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        categoryId,
        images: images.map((url) => url.trim()).filter(Boolean),
        stock: Number(stock),
        active,
      };

      if (isEdit && product) {
        await updateProduct(product.id, input);
        toast.success("Product updated");
      } else {
        await createProduct(input);
        toast.success("Product created");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Could not save product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium">
        Product name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Description
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={INPUT_CLASS}
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Price (PKR)
          <input
            required
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={INPUT_CLASS}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Compare-at price (optional)
          <input
            type="number"
            min={0}
            step="0.01"
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value)}
            className={INPUT_CLASS}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Category
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={INPUT_CLASS}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && (
            <span className="text-xs text-black/50">
              No categories yet — add one in the Categories tab first.
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Stock quantity
          <input
            required
            type="number"
            min={0}
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={INPUT_CLASS}
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Visible in store
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Product images</span>
        <p className="text-xs text-black/50">
          Add 1–3 photos. Host them anywhere (e.g. imgbb.com, Cloudinary, Google Photos share link) and paste the direct image URL below. The first photo is required and is used as the main product image; customers can slide through the rest on the product page.
        </p>
        {images.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="url"
              required={index === 0}
              value={url}
              onChange={(e) => updateImageUrl(index, e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className={`flex-1 ${INPUT_CLASS}`}
            />
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => removeImageField(index)}
                className="rounded-full p-2 text-black/50 hover:bg-black/5 hover:text-red-600 dark:hover:bg-white/10"
                aria-label="Remove image URL"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
        {images.length < 3 && (
          <button
            type="button"
            onClick={addImageField}
            className="flex w-fit items-center gap-1 rounded-lg border border-dashed border-black/20 px-3 py-1.5 text-xs font-medium text-black/60 hover:bg-black/5 dark:border-white/20 dark:text-white/60 dark:hover:bg-white/10"
          >
            <Plus size={14} />
            Add another image
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 w-fit rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
      >
        {submitting ? "Saving..." : isEdit ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
