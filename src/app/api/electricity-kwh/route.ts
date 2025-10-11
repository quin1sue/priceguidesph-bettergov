import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

let cachedResult: any = null;
let lastFetched: number | null = null;
const CACHE_DURATION = 1000 * 60 * 15;

export async function GET(_req: NextRequest) {
  const now = Date.now();

  //serve cached data if still fresh
  if (cachedResult && lastFetched && now - lastFetched < CACHE_DURATION) {
    return NextResponse.json(cachedResult, {
      headers: {
        "Cache-Control": "s-maxage=900, stale-while-revalidate=300",
      },
    });
  }

  try {
    const websiteUrl =
      "https://www.globalpetrolprices.com/Philippines/electricity_prices/";

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

    const prices = rowsData.filter((r) =>
      r.what.toLowerCase().includes("price")
    );
    const production = rowsData.filter(
      (r) => !r.what.toLowerCase().includes("price")
    );

    const metadata = await page.evaluate(() => {
      const description =
        document
          .querySelector("meta[name=Description]")
          ?.getAttribute("content") || "";
      return { description };
    });

    await browser.close();

    const result = { metadata, prices, production };

    cachedResult = result;
    lastFetched = now;

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "s-maxage=900, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Scraping failed:", error);

    //return cached data if scraping fails
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
