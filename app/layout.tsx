import Script from "next/script"
import { usePathname } from "next/navigation";  
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import HeaderWrapper from "./components/HeaderWrapper";
import TextureOverlay from "./components/TextureOverlay";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import GoogleAnalytics from "./components/GoogleAnalytics";


const aShadowWithin = localFont({
  src: [
    { path: "../public/fonts/AShadowWithin-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/AShadowWithin-Regular.woff", weight: "400", style: "normal" },
  ],
  variable: "--font-a-shadow-within",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A Shadow Within | Alternative Metal from Denver, CO",
  description:
    "Official website of A Shadow Within, an alternative metal band from Denver, CO. Listen on Spotify, watch music videos, and stay up to date on new releases.",
  keywords: [
    "A Shadow Within",
    "alternative metal",
    "metalcore",
    "Denver band",
    "Spotify",
    "YouTube",
  ],
  openGraph: {
    title: "A Shadow Within",
    description: "Alternative Metal band from Denver, CO. New music, videos, and merch.",
    url: "https://ashadowwithin.com",
    siteName: "A Shadow Within",
    images: [{ url: "https://ashadowwithin.com/web-app-manifest-512x512.png", width: 512, height: 512, alt: "A Shadow Within icon logo" }],
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://ashadowwithin.com"),
  twitter: {
    card: "summary_large_image",
    site: "@a_shadow_within",
    creator: "@a_shadow_within",
    title: "A Shadow Within",
    description: "Alternative metal band from Denver, CO. Listen now on Spotify and YouTube.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": "http://musicbrainz.org/artist/5e47474e-bcfe-4165-bbb0-42669f664ed5",
    name: "A Shadow Within",
    image: [
      "https://ashadowwithin.com/images/a-shadow-within.jpg", // swap to actual media URL
    ],
    logo: "https://ashadowwithin.com/a-shadow-within-logo.png",
    foundingLocation: {
      "@type": "City",
      name: "Denver",
    },
    url: "https://ashadowwithin.com",
    foundingDate: "2022",
    genre: "Metal",
    member: [
      {
        "@type": "OrganizationRole",
        member: {
          "@type": "Person",
          name: "David Bowick",
        },
        startDate: "2022",
        roleName: ["vocals", "guitar", "mixing", "production"],
      },
    ],
    sameAs: [
      "https://www.instagram.com/ashadowwithin",
      "https://www.youtube.com/@ashadowwithinmusic",
      "https://www.tiktok.com/@ashadowwithin",
      "https://ashadowwithinmerch.com/",
      "https://ashadowwithin.bandcamp.com/",
      "https://open.spotify.com/artist/30i42tQw7YOSEFgbPBYEqW",
      "https://music.apple.com/us/artist/a-shadow-within/1662683043",
      "https://twitter.com/a_shadow_within",
      "https://www.facebook.com/@ashadowwithin",
    ],
  };

  return (
    <html lang="en" className={aShadowWithin.variable}>
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Preconnects only to domains you actually use */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://img.youtube.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />

        {/* Shopify CDN (your product images, merch, etc.) */}
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://shopify-assets.shopifycdn.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.shopifycdn.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://image.shopifycdn.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Skip link for accessibility */}
        <a href="#main-content" className="skip-link">Skip to main content</a>

        <div className="siteWrapper">
        <HeaderWrapper />
        <main className="main" id="main-content">{children}</main>
        <Footer />
        <TextureOverlay />

        
        {/* JSON-LD Schema */}
        <Script
          id="schema-musicgroup"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "A Shadow Within",
            url: "https://ashadowwithin.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://ashadowwithin.com/?s={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }) }}
        />
        
        </div>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;

            gtag('js', new Date());
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'denied',
              personalization_storage: 'denied',
              security_storage: 'granted'
            });
          `}
        </Script>
        <CookieConsent />
      </body>
    </html>
  );
}