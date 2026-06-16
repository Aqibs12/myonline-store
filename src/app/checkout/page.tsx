"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HelpCircle, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import { useCartStore } from "@/lib/cart-store";
import { createOrder } from "@/lib/orders";
import { formatPrice, SHIPPING_FEE } from "@/lib/format";
import { validateCheckoutForm, type CheckoutFieldErrors } from "@/lib/validation";
import type { PaymentMethod } from "@/types";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; hint: string }[] = [
  { value: "cod", label: "Cash on Delivery (COD)", hint: "Cash On Delivery" },
  { value: "jazzcash", label: "JazzCash", hint: "We'll contact you to confirm payment details" },
  { value: "easypaisa", label: "Easypaisa", hint: "We'll contact you to confirm payment details" },
];

const fieldCls =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-700 dark:border-white/20 dark:bg-neutral-800 dark:text-white";

const fieldErrCls =
  "w-full rounded-lg border border-red-400 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-700 dark:bg-neutral-800 dark:text-white";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);

  // Contact
  const [email, setEmail] = useState("");
  const [emailOffers, setEmailOffers] = useState(true);

  // Delivery
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");

  // Payment / misc
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [errors, setErrors] = useState<CheckoutFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  const total = subtotal + SHIPPING_FEE - couponDiscount;

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  function handleApplyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponError("Invalid discount code.");
    setCouponApplied(null);
    setCouponDiscount(0);
  }

  if (!loading && items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link href="/products" className="mt-2 rounded-full bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">
          Continue shopping
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const fieldErrors = validateCheckoutForm(lastName, phone, address, city);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");

    setSubmitting(true);
    try {
      const { id: orderId, trackingNumber } = await createOrder({
        userId: user?.uid ?? "guest",
        userEmail: email || user?.email || "",
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
        shippingAddress: {
          fullName,
          phone,
          address,
          apartment: apartment || undefined,
          city,
          postalCode: postalCode || undefined,
        },
      });

      clear();

      const to = email || user?.email;
      if (to) {
        fetch("/api/send-order-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to,
            orderId,
            trackingNumber,
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
            shippingAddress: { fullName, phone, address, apartment: apartment || undefined, city, postalCode: postalCode || undefined },
          }),
        }).catch(() => {});
      }

      toast.success("Order placed! Check your email for confirmation.");
      router.push(user ? `/orders?placed=${orderId}` : "/");
    } catch (error) {
      console.error(error);
      toast.error("Could not place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">

          {/* ── Left: Form ── */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

            {/* Contact */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold">Contact</h2>
                {!user && (
                  <button type="button" onClick={() => {}} className="text-sm text-teal-700 hover:underline">
                    Sign in
                  </button>
                )}
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                readOnly={Boolean(user?.email)}
                className={`${fieldCls} ${user?.email ? "cursor-default opacity-70" : ""}`}
              />
              <label className="mt-2.5 flex cursor-pointer items-center gap-2.5 text-sm text-black/70 dark:text-white/70">
                <input
                  type="checkbox"
                  checked={emailOffers}
                  onChange={(e) => setEmailOffers(e.target.checked)}
                  className="h-4 w-4 accent-teal-700"
                />
                Email me with news and offers
              </label>
            </section>

            {/* Delivery */}
            <section>
              <h2 className="mb-3 text-base font-semibold">Delivery</h2>
              <div className="flex flex-col gap-2.5">
                {/* Country (fixed) */}
                <div className="relative">
                  <select
                    disabled
                    defaultValue="PK"
                    className={`${fieldCls} appearance-none pr-8 text-black/70 dark:text-white/70`}
                  >
                    <option value="PK">Pakistan</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-black/40">▼</span>
                  <span className="pointer-events-none absolute left-3 top-1 text-[10px] text-black/40 dark:text-white/40">Country/Region</span>
                </div>

                {/* First + Last name */}
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name (optional)"
                    className={fieldCls}
                  />
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (errors.lastName) setErrors((p) => ({ ...p, lastName: undefined }));
                      }}
                      placeholder="Last name"
                      className={errors.lastName ? fieldErrCls : fieldCls}
                    />
                    {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
                  </div>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors((p) => ({ ...p, address: undefined }));
                    }}
                    placeholder="Address"
                    className={errors.address ? fieldErrCls : fieldCls}
                  />
                  {errors.address && <span className="text-xs text-red-500">{errors.address}</span>}
                </div>

                {/* Apartment */}
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="Apartment, suite, etc. (optional)"
                  className={fieldCls}
                />

                {/* City + Postal code */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors((p) => ({ ...p, city: undefined }));
                      }}
                      placeholder="City"
                      className={errors.city ? fieldErrCls : fieldCls}
                    />
                    {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
                  </div>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postal code (optional)"
                    className={fieldCls}
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                      }}
                      placeholder="Phone"
                      className={`${errors.phone ? fieldErrCls : fieldCls} pr-10`}
                    />
                    <HelpCircle
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30"
                    />
                  </div>
                  {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                </div>
              </div>
            </section>

            {/* Shipping method */}
            <section>
              <h2 className="mb-3 text-base font-semibold">Shipping method</h2>
              <div className="flex items-center justify-between rounded-lg border border-teal-600 bg-teal-50 px-4 py-3 text-sm dark:bg-teal-950/30">
                <span className="font-medium text-teal-800 dark:text-teal-300">Standard Delivery</span>
                <span className="font-semibold text-teal-800 dark:text-teal-300">{formatPrice(SHIPPING_FEE)}</span>
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="mb-1 text-base font-semibold">Payment</h2>
              <p className="mb-3 flex items-center gap-1.5 text-xs text-black/50 dark:text-white/50">
                <Lock size={12} /> All transactions are secure and encrypted.
              </p>
              <div className="flex flex-col gap-2">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer flex-col rounded-lg border px-4 py-3 text-sm transition ${
                      paymentMethod === opt.value
                        ? "border-teal-600 bg-teal-50 dark:bg-teal-950/30"
                        : "border-black/15 hover:border-black/30 dark:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={opt.value}
                        checked={paymentMethod === opt.value}
                        onChange={() => setPaymentMethod(opt.value)}
                        className="accent-teal-700"
                      />
                      <span className="font-medium">{opt.label}</span>
                    </div>
                    {paymentMethod === opt.value && (
                      <p className="mt-2 border-t border-teal-200 pt-2 text-xs text-black/60 dark:border-teal-800 dark:text-white/60">
                        {opt.hint}
                      </p>
                    )}
                  </label>
                ))}
              </div>
            </section>

            {/* Billing address */}
            <section>
              <h2 className="mb-3 text-base font-semibold">Billing address</h2>
              <div className="flex flex-col gap-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-teal-600 bg-teal-50 px-4 py-3 text-sm dark:bg-teal-950/30">
                  <input type="radio" name="billing" defaultChecked className="accent-teal-700" />
                  <span className="font-medium">Same as shipping address</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-black/15 px-4 py-3 text-sm dark:border-white/20">
                  <input type="radio" name="billing" className="accent-teal-700" />
                  <span>Use a different billing address</span>
                </label>
              </div>
            </section>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-teal-700 py-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
            >
              {submitting ? "Placing order..." : "Complete order"}
            </button>

            {/* Policy links */}
            <div className="flex justify-center gap-4 text-xs text-black/40 dark:text-white/40">
              <Link href="/refund-policy" className="hover:underline">Refund policy</Link>
              <Link href="/privacy-policy" className="hover:underline">Privacy policy</Link>
              <Link href="/terms-of-service" className="hover:underline">Terms of service</Link>
            </div>

          </form>

          {/* ── Right: Order summary ── */}
          <div className="h-fit rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">Order summary</h2>
            <ul className="flex flex-col gap-2 text-sm">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg border border-black/10 object-cover" />
                    )}
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-[10px] font-bold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <span className="flex-1 text-black/70 dark:text-white/70">{item.name}</span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            {/* Coupon */}
            <div className="mt-4 border-t border-black/10 pt-4 dark:border-white/10">
              {couponApplied ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-teal-700">Code &quot;{couponApplied}&quot; applied</span>
                  <button
                    type="button"
                    onClick={() => { setCouponApplied(null); setCouponDiscount(0); setCouponCode(""); setCouponError(""); }}
                    className="text-xs text-black/40 underline hover:text-black"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                      placeholder="Discount code"
                      className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none transition focus:border-teal-700 dark:border-white/20 dark:bg-neutral-800"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="rounded-lg border border-black/15 px-4 py-2 text-sm font-medium transition hover:bg-black/5 dark:border-white/20"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <span className="text-xs text-red-500">{couponError}</span>}
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="mt-4 flex flex-col gap-1.5 border-t border-black/10 pt-3 text-sm dark:border-white/10">
              <div className="flex justify-between text-black/70 dark:text-white/70">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-black/70 dark:text-white/70">
                <span>Shipping</span>
                <span>{formatPrice(SHIPPING_FEE)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-teal-700">
                  <span>Discount</span>
                  <span>−{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-black/10 pt-2 text-base font-bold dark:border-white/10">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
