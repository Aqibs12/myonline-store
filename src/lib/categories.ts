import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { Category, CategoryInput } from "@/types";

const CATEGORIES = "categories";

function toCategory(id: string, data: Record<string, unknown>): Category {
  return {
    id,
    name: data.name as string,
    slug: data.slug as string,
  };
}

export async function listCategories(): Promise<Category[]> {
  try {
    const q = query(collection(getFirebaseDb(), CATEGORIES), orderBy("name"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toCategory(d.id, d.data()));
  } catch (error) {
    console.error("listCategories failed:", error);
    return [];
  }
}

export async function createCategory(input: CategoryInput): Promise<string> {
  const ref = await addDoc(collection(getFirebaseDb(), CATEGORIES), input);
  return ref.id;
}

export async function updateCategory(id: string, input: Partial<CategoryInput>): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), CATEGORIES, id), input);
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), CATEGORIES, id));
}
