import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { Product, ProductInput } from "@/types";

const PRODUCTS = "products";

function toProduct(id: string, data: Record<string, unknown>): Product {
  const createdAt = data.createdAt as Timestamp | undefined;
  const updatedAt = data.updatedAt as Timestamp | undefined;
  return {
    id,
    name: data.name as string,
    slug: data.slug as string,
    description: data.description as string,
    price: data.price as number,
    compareAtPrice: data.compareAtPrice as number | undefined,
    category: data.category as string,
    images: (data.images as string[]) ?? [],
    stock: data.stock as number,
    active: data.active as boolean,
    createdAt: createdAt?.toMillis() ?? Date.now(),
    updatedAt: updatedAt?.toMillis() ?? Date.now(),
  };
}

export async function listActiveProducts(category?: string): Promise<Product[]> {
  try {
    const constraints = [where("active", "==", true)];
    if (category) constraints.push(where("category", "==", category));
    const q = query(collection(getFirebaseDb(), PRODUCTS), ...constraints, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toProduct(d.id, d.data()));
  } catch (error) {
    // The storefront must keep rendering even if Firestore isn't reachable yet
    // (e.g. the database hasn't been created or security rules aren't deployed).
    console.error("listActiveProducts failed:", error);
    return [];
  }
}

export async function listAllProducts(): Promise<Product[]> {
  const q = query(collection(getFirebaseDb(), PRODUCTS), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toProduct(d.id, d.data()));
}

export async function getProduct(id: string): Promise<Product | null> {
  const ref = doc(getFirebaseDb(), PRODUCTS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return toProduct(snap.id, snap.data());
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = query(collection(getFirebaseDb(), PRODUCTS), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0]!;
  return toProduct(d.id, d.data());
}

export async function createProduct(input: ProductInput): Promise<string> {
  const ref = await addDoc(collection(getFirebaseDb(), PRODUCTS), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), PRODUCTS, id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), PRODUCTS, id));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
