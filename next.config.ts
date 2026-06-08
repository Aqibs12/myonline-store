import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product images are pasted as URLs from arbitrary external hosts (the
    // owner's chosen image host), so we skip Next.js's optimization proxy
    // and its remote-host allowlist entirely.
    unoptimized: true,
  },
};

export default nextConfig;
