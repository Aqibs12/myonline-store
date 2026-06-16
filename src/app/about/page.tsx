import Link from "next/link";

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME ?? "My Online Store";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">About Us</h1>
      <div className="mt-6 flex flex-col gap-4 text-black/70 dark:text-white/70">
        <p>
          Welcome to{" "}
          <strong className="text-black dark:text-white">{STORE_NAME}</strong> — your trusted
          online destination for quality products delivered across Pakistan.
        </p>
        <p>
          We started with a simple mission: make it easy for Pakistani households to find and buy
          quality products at fair prices, with the convenience of Cash on Delivery, JazzCash, and
          Easypaisa.
        </p>
        <p>
          All our products are carefully selected to ensure they meet our quality standards before
          we list them. We believe everyone deserves access to great products without overpaying.
        </p>
        <h2 className="mt-4 text-xl font-semibold text-black dark:text-white">Our Promise</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>Fast delivery across Pakistan</li>
          <li>15-day return policy for exchanges</li>
          <li>Secure payment with COD, JazzCash &amp; Easypaisa</li>
          <li>24/7 customer support</li>
        </ul>
      </div>
      <Link
        href="/products"
        className="mt-8 inline-block rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
      >
        Shop now
      </Link>
    </div>
  );
}
