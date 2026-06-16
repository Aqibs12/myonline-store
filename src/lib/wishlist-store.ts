import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product } from "@/types";

interface WishlistState {
  items: Product[];
  toggle: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  count: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) =>
        set((state) => ({
          items: state.items.some((i) => i.id === product.id)
            ? state.items.filter((i) => i.id !== product.id)
            : [...state.items, product],
        })),
      isWishlisted: (productId) => get().items.some((i) => i.id === productId),
      count: () => get().items.length,
    }),
    { name: "wishlist-storage", storage: createJSONStorage(() => localStorage) }
  )
);
