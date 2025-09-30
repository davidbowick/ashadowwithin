const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ShopifyFetchOptions = {
  query: string;
  variables?: Record<string, any>;
  tags?: string[]; // optional cache tags
  revalidate?: number; // seconds
};

export async function shopifyFetch<T>({
  query,
  variables,
  revalidate = 3600,
}: ShopifyFetchOptions): Promise<T> {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    throw new Error("Missing Shopify env vars");
  }

  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    // ISR on the server
    next: { revalidate },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify fetch failed: ${res.status} ${res.statusText} – ${text}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data as T;
}