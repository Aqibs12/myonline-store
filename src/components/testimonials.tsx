"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Madiha Somroo",
    text: "Masha Allah received parcel in good packing. Absolutely good product. Always recommend others to buy",
    rating: 5,
  },
  {
    name: "Nayab Khalid",
    text: "Absolutely love it same as shown in the picture. Quality of the product is good... worth of money",
    rating: 5,
  },
  {
    name: "Faryal Gull",
    text: "Highly Recommended! Just received my parcel and Alhamdullilah satisfied. Ordering two more",
    rating: 5,
  },
  {
    name: "Sara Ahmed",
    text: "Great quality and fast delivery. Exactly as described. Very happy with my purchase!",
    rating: 5,
  },
  {
    name: "Fatima Khan",
    text: "Excellent packaging and the product quality is amazing. Will definitely order again.",
    rating: 5,
  },
  {
    name: "Hira Baig",
    text: "Superb quality! Received on time and the product is even better than the pictures. Highly recommend!",
    rating: 5,
  },
];

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!ref.current) return;
    const card = ref.current.querySelector("[data-card]") as HTMLElement | null;
    const amount = card ? card.offsetWidth + 20 : 320;
    ref.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  }

  return (
    <section className="border-t border-black/10 bg-gray-50 py-14 dark:border-white/10 dark:bg-white/5">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-10 text-center text-2xl font-extrabold uppercase tracking-widest">
          Happy Customers
        </h2>

        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            aria-label="Previous"
            className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 md:-left-5"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Scrollable track */}
          <div
            ref={ref}
            className="flex gap-5 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {REVIEWS.map((review, i) => (
              <div
                key={i}
                data-card
                className="min-w-[260px] max-w-[320px] flex-1 shrink-0 rounded-xl bg-white p-6 shadow-md dark:bg-neutral-900 sm:min-w-[300px]"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={17} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-black/70 dark:text-white/65">
                  {review.text}
                </p>
                <p className="text-sm font-bold">{review.name}</p>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            aria-label="Next"
            className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 md:-right-5"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
