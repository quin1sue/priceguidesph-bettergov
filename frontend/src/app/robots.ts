import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    host: "https://price-guides.bettergov.ph",
    sitemap: `https://price-guides.bettergov.ph/sitemap.xml`,
  };
}
