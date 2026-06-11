import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  mergeItems: (items: CartItem[]) => void;
  clear: () => void;
  subtotal: () => number;
  totalQuantity: () => number;
}

const STORAGE_NAME = "cart-storage";

// The cart is namespaced per signed-in user (falling back to "guest") so that
// switching accounts on a shared device doesn't leak one person's cart to
// the next. setCartUser() below switches the namespace and re-reads storage.
let cartNamespace = "guest";

function namespacedKey(namespace: string): string {
  return `${STORAGE_NAME}:${namespace}`;
}

const namespacedStorage: StateStorage = {
  getItem: (_name) => localStorage.getItem(namespacedKey(cartNamespace)),
  setItem: (_name, value) => localStorage.setItem(namespacedKey(cartNamespace), value),
  removeItem: (_name) => localStorage.removeItem(namespacedKey(cartNamespace)),
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          const maxQty = product.stock;
          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, maxQty);
            return {
              items: state.items.map((i) =>
                i.productId === product.id ? { ...i, quantity: nextQty } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0] ?? null,
                quantity: Math.min(quantity, maxQty),
                stock: product.stock,
              },
            ],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),
      mergeItems: (incoming) =>
        set((state) => {
          const items = [...state.items];
          for (const item of incoming) {
            const idx = items.findIndex((i) => i.productId === item.productId);
            if (idx >= 0) {
              items[idx] = {
                ...items[idx],
                quantity: Math.min(items[idx].quantity + item.quantity, items[idx].stock),
              };
            } else {
              items.push(item);
            }
          }
          return { items };
        }),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: STORAGE_NAME, storage: createJSONStorage(() => namespacedStorage) }
  )
);

function readNamespaceItems(namespace: string): CartItem[] {
  try {
    const raw = localStorage.getItem(namespacedKey(namespace));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { state?: { items?: CartItem[] } };
    return parsed.state?.items ?? [];
  } catch {
    return [];
  }
}

// Call on sign-in/sign-out so each account gets its own persisted cart.
// Any items added as a guest before signing in are merged into the
// account's cart and the guest cart is cleared.
export function setCartUser(uid: string | null): void {
  if (typeof window === "undefined") return;
  const next = uid ?? "guest";
  if (next === cartNamespace) return;

  const guestItems = cartNamespace === "guest" ? readNamespaceItems("guest") : [];
  cartNamespace = next;
  useCartStore.persist.rehydrate();

  if (uid && guestItems.length > 0) {
    useCartStore.getState().mergeItems(guestItems);
    localStorage.removeItem(namespacedKey("guest"));
  }
}
