/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "shopify-assets.shopifycdn.com" },
      { protocol: "https", hostname: "cdn.shopifycdn.net" },
      { protocol: "https", hostname: "image.shopifycdn.com" }, // some stores
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

module.exports = nextConfig;