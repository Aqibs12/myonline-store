"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    tag: "New Arrivals Available",
    line1: "Transform Your",
    accent1: "Home",
    line2: "Elevate Your",
    accent2: "Space",
    desc: "Discover premium home essentials crafted to make every corner a statement of modern elegance.",
    cta: "/products",
    ctaLabel: "Shop Now",
  },
  {
    tag: "Cash on Delivery",
    line1: "Fast Delivery",
    accent1: "Nationwide",
    line2: "Easy 15-Day",
    accent2: "Returns",
    desc: "Orders dispatched within 4–5 business days. COD, JazzCash & Easypaisa accepted.",
    cta: "/products",
    ctaLabel: "Browse Products",
  },
  {
    tag: "Secure & Trusted",
    line1: "Quality You",
    accent1: "Trust",
    line2: "Prices You",
    accent2: "Deserve",
    desc: "We stand behind every product — shop with confidence and get 24/7 support.",
    cta: "/contact",
    ctaLabel: "Contact Us",
  },
] as const;

export function HeroSlider({ images = [] }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const count = SLIDES.length;

  const next = useCallback(() => setCurrent((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <div className="relative overflow-hidden bg-teal-700" style={{ minHeight: 460 }}>
      {SLIDES.map((slide, idx) => {
        // pick 3 images for this slide's right panel
        const panel = [
          images[idx * 3] ?? images[0],
          images[idx * 3 + 1] ?? images[1],
          images[idx * 3 + 2] ?? images[2],
        ].filter(Boolean) as string[];

        return (
          <div
            key={idx}
            aria-hidden={idx !== current}
            className={`absolute inset-0 flex transition-opacity duration-700 ${
              idx === current ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          >
            {/* ── Left — teal content ── */}
            <div className="flex w-full flex-col justify-center gap-5 bg-teal-700 px-8 py-14 text-white md:w-[45%] md:px-12 lg:px-16">
              <span className="inline-flex w-fit rounded-full border border-white/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80">
                {slide.tag}
              </span>

              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                {slide.line1}{" "}
                <span className="text-amber-400">{slide.accent1}</span>
                <br />
                {slide.line2}{" "}
                <span className="text-amber-400">{slide.accent2}</span>
              </h1>

              <p className="max-w-sm text-sm leading-relaxed text-white/75 sm:text-base">
                {slide.desc}
              </p>

              <Link
                href={slide.cta}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-amber-300 active:scale-95"
              >
                <ArrowRight size={16} />
                {slide.ctaLabel}
              </Link>
            </div>

            {/* ── Right — circular product images ── */}
            <div className="relative hidden overflow-hidden bg-[#f0ede8] md:flex md:w-[55%] md:items-center md:justify-center">
              {panel.length > 0 ? (
                <div className="relative h-[360px] w-[420px]">
                  {/* Center-left large circle */}
                  {panel[0] && (
                    <div className="absolute left-14 top-1/2 h-52 w-52 -translate-y-1/2 overflow-hidden rounded-full border-4 border-white shadow-xl">
                      <Image src={panel[0]} alt="" fill sizes="208px" className="object-cover" />
                    </div>
                  )}
                  {/* Top-right medium circle */}
                  {panel[1] && (
                    <div className="absolute right-10 top-8 h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-lg">
                      <Image src={panel[1]} alt="" fill sizes="160px" className="object-cover" />
                    </div>
                  )}
                  {/* Bottom-right small circle */}
                  {panel[2] && (
                    <div className="absolute bottom-8 right-16 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
                      <Image src={panel[2]} alt="" fill sizes="128px" className="object-cover" />
                    </div>
                  )}
                </div>
              ) : (
                /* Decorative placeholder when no images */
                <div className="flex flex-col items-center gap-6 text-teal-200/40">
                  <div className="relative h-56 w-56">
                    <div className="absolute inset-0 rounded-full border-4 border-teal-300/30" />
                    <div className="absolute inset-10 rounded-full border-4 border-teal-400/30" />
                    <div className="absolute inset-[72px] rounded-full bg-teal-600/30" />
                  </div>
                  <p className="text-sm">Add products to see images here</p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* ── Prev arrow ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded bg-black/65 text-white transition hover:bg-black active:scale-95"
      >
        <ChevronLeft size={22} />
      </button>

      {/* ── Next arrow ── */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded bg-black/65 text-white transition hover:bg-black active:scale-95"
      >
        <ChevronRight size={22} />
      </button>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-white" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
