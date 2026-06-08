const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME ?? "My Online Store";

export function Footer() {
  return (
    <footer className="border-t border-black/10 py-8 text-sm text-black/60 dark:border-white/10 dark:text-white/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center">
        <p>
          © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
        </p>
        <p>Cash on Delivery · JazzCash · Easypaisa</p>
      </div>
    </footer>
  );
}
