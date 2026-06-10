export interface Category {
  id: string;
  name: string;
  slug: string;
}

export type CategoryInput = Omit<Category, "id">;

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  images: string[];
  stock: number;
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

export interface UserProfile {
  uid: string;
  email: string | null;
  role: "owner" | "customer";
  createdAt: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "jazzcash" | "easypaisa";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
  createdAt: number;
  updatedAt: number;
}

export type OrderInput = Omit<Order, "id" | "createdAt" | "updatedAt" | "status">;
