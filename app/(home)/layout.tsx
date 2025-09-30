import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";

const aShadowWithin = localFont({
  src: [
    { path: "../../public/fonts/AShadowWithin-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/AShadowWithin-Regular.woff", weight: "400", style: "normal" },
  ],
  variable: "--font-a-shadow-within",
  display: "swap",
});

export { metadata } from "../layout"; // reuse global metadata

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={aShadowWithin.variable}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}