"use client";

import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { createCategory, deleteCategory, listCategories } from "@/lib/categories";
import { slugify } from "@/lib/format";
import { INPUT_CLASS } from "@/lib/ui";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    setCategories(await listCategories());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await createCategory({ name: trimmed, slug: slugify(trimmed) });
      toast.success("Category created");
      setName("");
      refresh();
    } catch (error) {
      console.error(error);
      toast.error("Could not create category");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(category: Category) {
    if (!confirm(`Delete "${category.name}"? Products using this category will need to be reassigned.`)) return;
    try {
      await deleteCategory(category.id);
      toast.success("Category deleted");
      refresh();
    } catch (error) {
      console.error(error);
      toast.error("Could not delete category");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Categories</h2>

      <form onSubmit={handleSubmit} className="flex max-w-md gap-2">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Racks"
          className={`flex-1 ${INPUT_CLASS}`}
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
        >
          Add
        </button>
      </form>

      {categories === null ? (
        <p className="text-sm text-black/50">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">No categories yet. Add one above.</p>
      ) : (
        <div className="flex max-w-md flex-col divide-y divide-black/10 overflow-hidden rounded-xl border border-black/10 dark:divide-white/10 dark:border-white/10">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-3 p-3">
              <div className="flex-1">
                <p className="text-sm font-medium">{category.name}</p>
                <p className="text-xs text-black/50">{category.slug}</p>
              </div>
              <button
                onClick={() => handleDelete(category)}
                className="rounded-full p-2 text-black/50 hover:bg-black/5 hover:text-red-600 dark:hover:bg-white/10"
                aria-label="Delete category"
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
