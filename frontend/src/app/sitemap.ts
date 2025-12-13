import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: "https://price-guides.bettergov.ph",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      images: ["https://price-guides.bettergov.ph/banner-white.png"],
    },
    {
      url: "https://price-guides.bettergov.ph/about",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
  const dynamicUrls: MetadataRoute.Sitemap = [
    "drug-price-index",
    "cigarette-index",
    "daily-price-index",
    "diesel",
    "indicator",
    "currency-exchange",
  ].map((category) => ({
    url: `https://price-guides.bettergov.ph/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));
  return [...staticUrls, ...dynamicUrls];
}
