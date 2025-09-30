import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ashadowwithin.com";

  // Static routes
  const routes = ["", "/music", "/videos", "/merch", "/contact"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1.0 : 0.8,
    })
  );

  // TODO: pull dynamic merch + music if you want
  // Example: add products from Shopify
  // const products = await fetchShopifyProducts();
  // products.map(p => ({ url: `${baseUrl}/merch/${p.handle}`, lastModified: new Date().toISOString() }))

  return [...routes];
}