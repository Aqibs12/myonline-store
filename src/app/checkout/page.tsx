"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import { useCartStore } from "@/lib/cart-store";
import { createOrder } from "@/lib/orders";
import { formatPrice, SHIPPING_FEE } from "@/lib/format";
import { inputClass } from "@/lib/ui";
import { validateCheckoutForm, type CheckoutFieldErrors } from "@/lib/validation";
import type { PaymentMethod } from "@/types";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; hint: string }[] = [
  { value: "cod", label: "Cash on Delivery", hint: "Pay in cash when your order arrives" },
  { value: "jazzcash", label: "JazzCash", hint: "We'll contact you to confirm payment details" },
  { value: "easypaisa", label: "Easypaisa", hint: "We'll contact you to confirm payment details" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const total = subtotal + SHIPPING_FEE;
  const clear = useCartStore((s) => s.clear);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [errors, setErrors] = useState<CheckoutFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  if (!loading && items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link href="/products" className="mt-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700">
          Continue shopping
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const fieldErrors = validateCheckoutForm(fullName, phone, address, city);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const orderId = await createOrder({
        userId: user?.uid ?? "guest",
        userEmail: user?.email ?? "",
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        subtotal,
        shippingFee: SHIPPING_FEE,
        total,
        paymentMethod,
        shippingAddress: { fullName, phone, address, city, notes: notes || undefined },
      });
      clear();
      toast.success("Order placed!");
      router.push(user ? `/orders?placed=${orderId}` : "/");
    } catch (error) {
      console.error(error);
      toast.error("Could not place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {!loading && !user && (
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Checking out as a guest.{" "}
          <Link href="/login" className="font-semibold text-orange-600 hover:underline">
            Sign in
          </Link>{" "}
          to track this order in your account.
        </p>
      )}

      <div className="mt-6 grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">Shipping details</h2>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Full name
            <input
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
              }}
              className={inputClass(Boolean(errors.fullName))}
            />
            {errors.fullName && <span className="text-xs text-red-500">{errors.fullName}</span>}
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Phone number
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              placeholder="03XX-XXXXXXX"
              className={inputClass(Boolean(errors.phone))}
            />
            {errors.phone ? (
              <span className="text-xs text-red-500">{errors.phone}</span>
            ) : (
              <span className="text-xs text-black/40">We currently only deliver within Pakistan.</span>
            )}
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Address
            <textarea
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
              }}
              rows={2}
              placeholder="House #, street, area"
              className={inputClass(Boolean(errors.address))}
            />
            {errors.address && <span className="text-xs text-red-500">{errors.address}</span>}
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            City
            <input
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
              }}
              className={inputClass(Boolean(errors.city))}
            />
            {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Order notes (optional)
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={inputClass()}
            />
          </label>

          <h2 className="mt-2 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">Payment method</h2>
          <div className="flex flex-col gap-2">
            {PAYMENT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-black/15 p-3 text-sm transition has-[:checked]:border-orange-600 has-[:checked]:bg-orange-50 dark:border-white/20 dark:has-[:checked]:bg-orange-950/20"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={opt.value}
                  checked={paymentMethod === opt.value}
                  onChange={() => setPaymentMethod(opt.value)}
                  className="mt-0.5"
                />
                <span>
                  <span className="block font-medium">{opt.label}</span>
                  <span className="block text-black/50 dark:text-white/50">{opt.hint}</span>
                </span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
          >
            {submitting ? "Placing order..." : `Place order — ${formatPrice(total)}`}
          </button>
        </form>

        <div className="h-fit rounded-xl border border-black/10 p-4 dark:border-white/10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">Order summary</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-2">
                <span className="text-black/70 dark:text-white/70">
                  {item.name} <span className="text-black/40">× {item.quantity}</span>
                </span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-1.5 border-t border-black/10 pt-3 text-sm dark:border-white/10">
            <div className="flex justify-between text-black/70 dark:text-white/70">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-black/70 dark:text-white/70">
              <span>Standard Shipping</span>
              <span>{formatPrice(SHIPPING_FEE)}</span>
            </div>
            <div className="flex justify-between border-t border-black/10 pt-1.5 font-bold dark:border-white/10">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
