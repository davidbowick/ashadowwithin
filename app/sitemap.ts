import { MetadataRoute } from "next";
import { getReleases } from "./lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ashadowwithin.com";

  // Static routes
  const routes = ["", "/music", "/videos", "/merch", "/contact", "/lyrics"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1.0 : 0.8,
    })
  );

  // Add releases (music + lyrics) when they have slugs
  const releases: any[] = await getReleases();
  const releaseRoutes = (releases || [])
    .map((r) => {
      if (!r) return null;
      // support slug as string (slug.current projected) or as object { current }
      const slug = typeof r.slug === "string" ? r.slug : r.slug && r.slug.current;
      if (!slug) return null;
      return { r, slug };
    })
    .filter(Boolean)
    .flatMap(({ r, slug }: any) => {
      const lastModified = r.releaseDate ? new Date(r.releaseDate).toISOString() : new Date().toISOString();
      return [
        {
          url: `${baseUrl}/music/${slug}`,
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        },
        {
          url: `${baseUrl}/lyrics/${slug}`,
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        },
      ];
    });

  return [...routes, ...releaseRoutes];
}