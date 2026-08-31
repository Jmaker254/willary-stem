import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    // Serve modern formats; Vercel's image CDN handles resize + caching.
    formats: ["image/avif", "image/webp"],
    // Uploaded media can live on Vercel Blob or any https host the admin pastes.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    // The admin proxy (middleware) otherwise truncates request bodies at 10MB,
    // which breaks video uploads to /admin/media/upload. Match the 64MB cap in
    // lib/upload.ts with headroom.
    proxyClientMaxBodySize: "128mb",
  },
};

export default nextConfig;
