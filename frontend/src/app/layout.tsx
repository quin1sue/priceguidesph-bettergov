import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EkonoTrack",
  description:
    "Ekonotrack is an economic and financial data platform aimed at promoting transparency and awareness.",
  authors: [
    { name: "Alquin Suedad", url: "https://github.com/quin1sue" },
    {
      name: "Sam Daniel Mugar",
      url: "https://www.linkedin.com/in/sam-daniel-mugar/",
    },
  ],
  openGraph: {
    type: "website",
    title: "EkonoTrack",
    description:
      "Ekonotrack is an economic and financial data platform aimed at promoting transparency and awareness.",
    url: "http:localhost:3000",
    images: [
      {
        url: "/ekonotrack-banner.png",
        width: 1200,
        height: 630,
        alt: "EkonoTrack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EkonoTrack",
    description:
      "Ekonotrack is an economic and financial data platform aimed at promoting transparency and awareness.",
    images: ["/ekonotrack-banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
