import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { startupImage } from "@/lib/metadata";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { AppShell } from "@/components/custom/global/app-shell";
export const metadata: Metadata = {
  title: {
    template: "%s | Price Guides",
    default: "Price Guides | BetterGovPh",
  },
  description:
    "Philippine Price Guides is an economic and financial data platform aimed at promoting transparency and awareness.",
  keywords: ["bettergov", "phpriceguides", "priceguides"],
  icons: { icon: "/icon.png", apple: { url: "/icons/apple-icon-180.png" } },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    startupImage: startupImage,
  },
  creator: "Alquin Suedad",
  publisher: "BetterGovPh",
  authors: [
    { name: "Alquin Suedad", url: "https://github.com/quin1sue" },
    {
      name: "Sam Daniel Mugar",
      url: "https://www.linkedin.com/in/sam-daniel-mugar/",
    },
    { name: "BetterGovPh", url: "https://github.com/bettergovph" },
  ],
  metadataBase: new URL("https://price-guides.bettergov.ph"),
  openGraph: {
    type: "website",
    title: "Philippine Price Guides",
    description:
      "Philippine Price Guides is an economic and financial data platform aimed at promoting transparency and awareness.",
    url: "https://price-guides.bettergov.ph",
    images: [
      {
        url: "/banner-white.png",
        width: 1200,
        height: 630,
        alt: "phpriceguides",
      },
    ],
    locale: "tl_PH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Philippine Price Guides",
    description:
      "Price Guides is an economic and financial data platform aimed at promoting transparency and awareness.",
    images: ["/banner-white.png"],
  },
  alternates: {
    canonical: "https://price-guides.bettergov.ph",
    languages: {
      "tl-PH": "/tl-PH",
      "en-PH": "/en-PH",
      "en-US": "/en-US",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script
        id="org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Philippine Price Guides",
            url: "https://price-guides.bettergov.ph",
            logo: "https://price-guides.bettergov.ph/icon.png",
            sameAs: [
              "https://github.com/quin1sue",
              "https://www.linkedin.com/in/sam-daniel-mugar",
            ],
          }),
        }}
      />

      <body className="bg-slate-50 font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white focus:not-sr-only focus:outline-2 focus:outline-offset-2 focus:outline-blue-700"
        >
          Skip to main content
        </a>
        <AppShell>{children}</AppShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
