export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-2 text-black/60 dark:text-white/60">
        We&apos;re here to help. Reach out through any of the channels below.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-black/10 p-6 dark:border-white/10">
          <h2 className="font-semibold">Email</h2>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            For orders, returns, and general inquiries.
          </p>
          <a
            href="mailto:shop@myonlinestore.pk"
            className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline"
          >
            shop@myonlinestore.pk
          </a>
        </div>

        <div className="rounded-xl border border-black/10 p-6 dark:border-white/10">
          <h2 className="font-semibold">Phone / WhatsApp</h2>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            Available 24/7 for support.
          </p>
          <a
            href="tel:+923000000000"
            className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline"
          >
            +92-300-0000000
          </a>
        </div>

        <div className="rounded-xl border border-black/10 p-6 dark:border-white/10 sm:col-span-2">
          <h2 className="font-semibold">Return Policy</h2>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            We offer a 15-day return policy. If you are not satisfied with your purchase, contact us
            within 15 days of delivery and we will arrange an exchange. Items must be unused and in
            original packaging.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-teal-50 p-6 dark:bg-teal-900/20">
        <p className="text-sm text-teal-800 dark:text-teal-300">
          <strong>Business hours:</strong> We respond to all inquiries within 24 hours. For urgent
          matters, please call or WhatsApp us directly.
        </p>
      </div>
    </div>
  );
}
