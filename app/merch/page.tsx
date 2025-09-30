import Image from "next/image";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { shopifyFetch } from "@/lib/shopify";
import Script from "next/script";

const COLLECTION_HANDLE = process.env.SHOPIFY_COLLECTION_HANDLE || "all";

type ProductNode = {
  id: string;
  title: string;
  handle: string;
  onlineStoreUrl: string | null;
  featuredImage: {
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
};

type CollectionQuery = {
  collectionByHandle: {
    title: string;
    products: {
      nodes: ProductNode[];
    };
  } | null;
};

const QUERY = /* GraphQL */ `
  query CollectionByHandle($handle: String!, $numProducts: Int = 24) {
    collectionByHandle(handle: $handle) {
      title
      products(first: $numProducts, sortKey: CREATED, reverse: true) {
        nodes {
          id
          title
          handle
          onlineStoreUrl
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

async function getCollection() {
  const data = await shopifyFetch<CollectionQuery>({
    query: QUERY,
    variables: { handle: COLLECTION_HANDLE, numProducts: 24 },
    revalidate: 1800, // refresh every 30 min
  });
  return data.collectionByHandle;
}

// helper function
function formatPrice(amount: string, currency: string): string {
  const value = parseFloat(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export async function generateMetadata(): Promise<Metadata> {
  const collection = await getCollection();
  const title = collection?.title ?? "Merch";
  return {
    title: `${title} | A Shadow Within`,
    description:
      "Official A Shadow Within merch – tees, hoodies, and more. New items added regularly.",
    openGraph: {
      title: `${title} | A Shadow Within`,
      description:
        "Shop official A Shadow Within merchandise.",
      url: "https://ashadowwithin.com/merch",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | A Shadow Within`,
      description: "Shop official A Shadow Within merchandise.",
    },
  };
}

export default async function MerchPage() {
  const collection = await getCollection();
  const products = collection?.products.nodes ?? [];

  if (!products.length) {
    return (
      <main className={styles.container}>
        <h1>Merch</h1>
        <p>No products found. Check your Shopify collection handle.</p>
      </main>
    );
  }

  // Prepare JSON-LD objects
  const productJsonLd = products.map((p) => {
    const img = p.featuredImage;
    const url =
      p.onlineStoreUrl ??
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/products/${p.handle}`;
    const price = p.priceRange.minVariantPrice;

    return {
      "@type": "Product",
      name: p.title,
      image: img ? img.url : undefined,
      url,
      offers: {
        "@type": "Offer",
        price: price.amount,
        priceCurrency: price.currencyCode,
        availability: "https://schema.org/InStock", // could be dynamic
        url,
      },
      brand: {
        "@type": "MusicGroup",
        name: "A Shadow Within",
      },
    };
  });

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url:
        p.onlineStoreUrl ??
        `https://${process.env.SHOPIFY_STORE_DOMAIN}/products/${p.handle}`,
      name: p.title,
    })),
  };


  return (
    <main className={styles.container}>
      {/* SEO Structured Data */}
      <Script
  id="merch-jsonld"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      [
        // ItemList schema
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url:
              p.onlineStoreUrl ??
              `https://${process.env.SHOPIFY_STORE_DOMAIN}/products/${p.handle}`,
            name: p.title,
          })),
        },
        // Product schemas
        ...products.map((p) => {
          const img = p.featuredImage;
          const url =
            p.onlineStoreUrl ??
            `https://${process.env.SHOPIFY_STORE_DOMAIN}/products/${p.handle}`;
          const price = p.priceRange.minVariantPrice;

          return {
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.title,
            image: img ? img.url : undefined,
            url,
            offers: {
              "@type": "Offer",
              price: price.amount,
              priceCurrency: price.currencyCode,
              availability: "https://schema.org/InStock", // could be dynamic
              url,
            },
            brand: {
              "@type": "MusicGroup",
              name: "A Shadow Within",
            },
          };
        }),
      ],
      null,
      2
    ),
  }}
/>
      <div className={styles.headerRow}>
        <h1>{collection?.title ?? "Merch"}</h1>
        <a
          className={styles.viewAll}
          href={`https://${process.env.SHOPIFY_STORE_DOMAIN}/collections/${COLLECTION_HANDLE}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View all →
        </a>
      </div>

      <section className={styles.grid}>
        {products.map((p) => {
          const img = p.featuredImage;
          const price = formatPrice(
  p.priceRange.minVariantPrice.amount,
  p.priceRange.minVariantPrice.currencyCode
);
          const url =
            p.onlineStoreUrl ??
            `https://${process.env.SHOPIFY_STORE_DOMAIN}/products/${p.handle}`;

          return (
            <article key={p.id} className={styles.card}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {img ? (
                  <Image
                    src={img.url}
                    alt={img.altText ?? p.title}
                    width={img.width || 600}
                    height={img.height || 600}
                    className={styles.image}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.imageFallback} />
                )}
                <h2>{p.title}</h2>
                <p className={styles.price}>{price}</p>
              </a>
            </article>
          );
        })}
      </section>
    </main>
  );
}