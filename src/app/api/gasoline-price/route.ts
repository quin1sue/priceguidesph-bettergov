import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

let cachedResult: any = null;
let lastFetched: number | null = null;
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

export async function GET(_req: NextRequest) {
  const now = Date.now();

  if (cachedResult && lastFetched && now - lastFetched < CACHE_DURATION) {
    return NextResponse.json(cachedResult, {
      headers: {
        "Cache-Control": "s-maxage=900, stale-while-revalidate=300",
      },
    });
  }

  try {
    const websiteUrl =
      "https://www.globalpetrolprices.com/Philippines/gasoline_prices/";

    const browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.goto(websiteUrl, { waitUntil: "networkidle" });

    const rowsData: { what: string; value: string }[] = await page.$$eval(
      "tbody tr",
      (rows) =>
        Array.from(rows).map((row) => {
          const cells = row.querySelectorAll("td");
          return {
            what: cells[0]?.textContent?.trim() || "",
            value: cells[1]?.textContent?.trim() || "",
          };
        })
    );

    const metadata = await page.evaluate(() => {
      return {
        description:
          document
            .querySelector("meta[name=Description]")
            ?.getAttribute("content") || "",
      };
    });

    await browser.close();

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

    const analytics: { what: string; value: string }[] = [];
    const generalInfo: { what: string; value: string }[] = [];
    const gasolinePricesPHP: { what: string; value: string }[] = [];

    for (const row of rowsData) {
      const lower = row.what.toLowerCase();
      if (analyticsKeywords.some((k) => lower.includes(k))) analytics.push(row);
      else if (generalKeywords.some((k) => lower.includes(k)))
        generalInfo.push(row);
      else if (recentKeywords.some((k) => lower.includes(k)))
        gasolinePricesPHP.push(row);
    }

    const result = { metadata, analytics, generalInfo, gasolinePricesPHP };

    cachedResult = result;
    lastFetched = now;

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "s-maxage=900, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Scraping failed:", error);

    if (cachedResult) {
      return NextResponse.json(cachedResult, {
        headers: {
          "Cache-Control": "s-maxage=900, stale-while-revalidate=300",
        },
      });
    }

    return NextResponse.json(
      { error: "Failed to scrape website" },
      { status: 500 }
    );
  }
}
