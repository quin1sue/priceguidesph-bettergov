import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Philippine Price Guides",
    default: "Philippine Price Guides | BetterGovPh",
  },
  description:
    "Philippine Price Guides is an economic and financial data platform aimed at promoting transparency and awareness.",
  keywords: ["bettergov", "phpriceguides"],
  icons: { icon: "/icon.png" },

  authors: [
    { name: "Alquin Suedad", url: "https://github.com/quin1sue" },
    {
      name: "Sam Daniel Mugar",
      url: "https://www.linkedin.com/in/sam-daniel-mugar/",
    },
  ],
  metadataBase: new URL("https://philippine-price-guides.vercel.app"),
  openGraph: {
    type: "website",
    title: "Philippine Price Guides",
    description:
      "Philippine Price Guides is an economic and financial data platform aimed at promoting transparency and awareness.",
    url: "https://philippine-price-guides.vercel.app",
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
      "Philippine Price Guides is an economic and financial data platform aimed at promoting transparency and awareness.",
    images: ["/banner-white.png"],
  },
  alternates: {
    canonical: "https://philippine-price-guides.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
  },
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
            url: "https://philippine-price-guides.vercel.app",
            logo: "https://philippine-price-guides.vercel.app/icon.png",
            sameAs: [
              "https://github.com/quin1sue",
              "https://www.linkedin.com/in/sam-daniel-mugar/",
            ],
          }),
        }}
      />

      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
