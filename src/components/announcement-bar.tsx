"use client";

import { useState } from "react";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="flex items-center justify-center gap-4 bg-green-700 px-4 py-2 text-sm text-white">
      <span>Cash on Delivery available nationwide · Orders dispatched in 4–5 business days</span>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-white/70 transition hover:text-white"
        aria-label="Dismiss"
      >
        × close
      </button>
    </div>
  );
}
