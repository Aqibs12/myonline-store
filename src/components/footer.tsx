import Link from "next/link";

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME ?? "My Online Store";

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-gray-50 dark:border-white/10 dark:bg-white/5">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <span className="text-base font-bold">{STORE_NAME}</span>
            <p className="text-sm text-black/60 dark:text-white/50">
              Quality products delivered to your door across Pakistan.
            </p>
            <div className="flex flex-col gap-1 text-sm text-black/55 dark:text-white/40">
              <a href="mailto:shop@myonlinestore.pk" className="hover:text-green-600">
                shop@myonlinestore.pk
              </a>
              <a href="tel:+923000000000" className="hover:text-green-600">
                +92-300-0000000
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold uppercase tracking-wide">Quick Links</span>
            <div className="flex flex-col gap-2 text-sm text-black/60 dark:text-white/50">
              <Link href="/" className="hover:text-green-600 hover:underline">
                Home
              </Link>
              <Link href="/products" className="hover:text-green-600 hover:underline">
                All Products
              </Link>
              <Link href="/about" className="hover:text-green-600 hover:underline">
                About Us
              </Link>
              <Link href="/contact" className="hover:text-green-600 hover:underline">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold uppercase tracking-wide">Customer Care</span>
            <div className="flex flex-col gap-2 text-sm text-black/60 dark:text-white/50">
              <Link href="/orders" className="hover:text-green-600 hover:underline">
                My Orders
              </Link>
              <Link href="/contact" className="hover:text-green-600 hover:underline">
                Return Policy
              </Link>
              <Link href="/contact" className="hover:text-green-600 hover:underline">
                Track Order
              </Link>
              <Link href="/contact" className="hover:text-green-600 hover:underline">
                FAQ
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold uppercase tracking-wide">We Accept</span>
            <div className="flex flex-col gap-2 text-sm text-black/60 dark:text-white/50">
              <span>Cash on Delivery</span>
              <span>JazzCash</span>
              <span>Easypaisa</span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-black/10 pt-6 text-center text-sm text-black/50 dark:border-white/10 dark:text-white/40">
          <p>
            © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
