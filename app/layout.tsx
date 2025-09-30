import { usePathname } from "next/navigation";  
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import HeaderWrapper from "./components/HeaderWrapper";
import TextureOverlay from "./components/TextureOverlay";
import Footer from "./components/Footer";


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "A Shadow Within band logo" }],
    locale: "en_US",
    type: "website",
  },
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
  
  return (
    <html lang="en" className={aShadowWithin.variable}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>
        {/* Skip link for accessibility */}
  <a href="#main-content" className="skip-link">Skip to main content</a>

        <div className="siteWrapper">
        <HeaderWrapper />
        <main className="main" id="main-content">{children}</main>
        <Footer />
        <TextureOverlay />
        </div>
      </body>
    </html>
  );
}