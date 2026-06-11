import {
  addDoc,
  collection,
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
import type { Order, OrderInput, OrderStatus } from "@/types";

const ORDERS = "orders";

function toOrder(id: string, data: Record<string, unknown>): Order {
  const createdAt = data.createdAt as Timestamp | undefined;
  const updatedAt = data.updatedAt as Timestamp | undefined;
  return {
    id,
    userId: data.userId as string,
    userEmail: data.userEmail as string,
    items: data.items as Order["items"],
    subtotal: data.subtotal as number,
    total: data.total as number,
    status: data.status as OrderStatus,
    paymentMethod: data.paymentMethod as Order["paymentMethod"],
    shippingAddress: data.shippingAddress as Order["shippingAddress"],
    createdAt: createdAt?.toMillis() ?? Date.now(),
    updatedAt: updatedAt?.toMillis() ?? Date.now(),
  };
}

export async function createOrder(input: OrderInput): Promise<string> {
  const ref = await addDoc(collection(getFirebaseDb(), ORDERS), {
    ...input,
    status: "pending" satisfies OrderStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listOrdersForUser(userId: string): Promise<Order[]> {
  const q = query(collection(getFirebaseDb(), ORDERS), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toOrder(d.id, d.data())).sort((a, b) => b.createdAt - a.createdAt);
}

export async function listAllOrders(): Promise<Order[]> {
  const q = query(collection(getFirebaseDb(), ORDERS), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toOrder(d.id, d.data()));
}

export async function getOrder(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(getFirebaseDb(), ORDERS, id));
  if (!snap.exists()) return null;
  return toOrder(snap.id, snap.data());
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), ORDERS, id), {
    status,
    updatedAt: serverTimestamp(),
  });
}
