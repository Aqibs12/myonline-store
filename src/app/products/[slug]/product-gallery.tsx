"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

const SWIPE_THRESHOLD = 40;

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black/5 dark:bg-white/10">
        <div className="flex h-full w-full items-center justify-center text-sm text-black/40">No image</div>
      </div>
    );
  }

  function showPrev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function showNext() {
    setIndex((i) => (i + 1) % images.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]!.clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0]!.clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD) showPrev();
    else if (delta < -SWIPE_THRESHOLD) showNext();
    touchStartX.current = null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-square w-full touch-pan-y overflow-hidden rounded-xl bg-black/5 dark:bg-white/10"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[index]!}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-black shadow transition hover:bg-white dark:bg-black/60 dark:text-white dark:hover:bg-black/80"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-black shadow transition hover:bg-white dark:bg-black/60 dark:text-white dark:hover:bg-black/80"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={clsx("h-1.5 w-1.5 rounded-full", i === index ? "bg-white" : "bg-white/50")}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className={clsx(
                "relative aspect-square overflow-hidden rounded-lg bg-black/5 ring-2 transition dark:bg-white/10",
                i === index ? "ring-orange-600" : "ring-transparent"
              )}
            >
              <Image src={img} alt={name} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
