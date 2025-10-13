import * as cheerio from "cheerio";

type RowData = {
  what: string;
  value: string;
};

type ScrapedData = {
  metadata: {
    description: string;
  };
  analytics: RowData[];
  generalInfo: RowData[];
  gasolinePricesPHP: RowData[];
};

let cachedResult: ScrapedData | null = null;
let lastFetched: number | null = null;
const CACHE_DURATION = 1000 * 60 * 15;

export async function scrapeGasolinePrices(): Promise<ScrapedData> {
  const now = Date.now();

  // Return cached result if still valid
  if (cachedResult && lastFetched && now - lastFetched < CACHE_DURATION) {
    return cachedResult;
  }

  try {
    const websiteUrl =
      "https://www.globalpetrolprices.com/Philippines/gasoline_prices/";

    const response = await fetch(websiteUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const rowsData: RowData[] = [];
    $("tbody tr").each((_, row) => {
      const cells = $(row).find("td");
      const what = $(cells[0]).text().trim();
      const value = $(cells[1]).text().trim();

      if (what && value) {
        rowsData.push({ what, value });
      }
    });

    const metadata = {
      description: $("meta[name=Description]").attr("content") || "",
    };

    // keyword to MATCH columns and rows
    const analyticsKeywords = [
      "percent of world average",
      "correlation with crude oil",
      "percent change if oil prices",
      "correlation with usd exchange rate",
      "price flexibility index",
      "correlation with diesel fuel",
      "percent of diesel price",
      "cost of 40 liter",
    ];

    const generalKeywords = [
      "current price",
      "measure",
      "last update",
      "data availability",
      "data frequency",
    ];

    const recentKeywords = [
      "current price",
      "one month ago",
      "three months ago",
      "one year ago",
    ];

    const analytics: RowData[] = [];
    const generalInfo: RowData[] = [];
    const gasolinePricesPHP: RowData[] = [];

    for (const row of rowsData) {
      const lower = row.what.toLowerCase();
      if (analyticsKeywords.some((k) => lower.includes(k))) {
        analytics.push(row);
      } else if (generalKeywords.some((k) => lower.includes(k))) {
        generalInfo.push(row);
      } else if (recentKeywords.some((k) => lower.includes(k))) {
        gasolinePricesPHP.push(row);
      }
    }

    const result: ScrapedData = {
      metadata,
      analytics,
      generalInfo,
      gasolinePricesPHP,
    };

    // Update cache
    cachedResult = result;
    lastFetched = now;

    return result;
  } catch (error) {
    console.error("Scraping failed:", error);

    // Return cached result if available, otherwise throw
    if (cachedResult) {
      return cachedResult;
    }

    throw new Error("Failed to scrape website and no cache available");
  }
}
