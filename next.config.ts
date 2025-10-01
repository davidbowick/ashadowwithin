/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "shopify-assets.shopifycdn.com" },
      { protocol: "https", hostname: "cdn.shopifycdn.net" },
      { protocol: "https", hostname: "image.shopifycdn.com" },
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },

  async headers() {
    return [
      // HTML pages (exclude Next internals + file assets)
      {
        source:
          "/((?!_next/|api/|.*\\.(?:js|css|json|xml|txt|ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2)).*)",
        headers: [
          {
            key: "Cache-Control",
            // CDN (s-maxage) caches for 5 minutes, browsers revalidate immediately.
            value: "public, max-age=0, s-maxage=300, stale-while-revalidate=60",
          },
        ],
      },

      // Static assets: cache hard (fingerprinted by Next)
      {
        source: "/:all*(js|css)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:all*(woff|woff2|ttf|otf)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },

      // APIs should usually be fresh
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

module.exports = nextConfig;