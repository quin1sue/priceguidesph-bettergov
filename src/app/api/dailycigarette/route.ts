import { parseDaPdfCig } from "@/functions/parseCigPdf";
import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

let cachedResult: any = null;
let lastFetched: number | null = null;
const CACHE_DURATION = 1000 * 60 * 60 * 6;

export async function GET(_req: NextRequest) {
  const now = Date.now();

  if (cachedResult && lastFetched && now - lastFetched < CACHE_DURATION) {
    return NextResponse.json(cachedResult, {
      headers: {
        "Cache-Control": "s-maxage=21600, stale-while-revalidate=3600",
      },
    });
  }

  try {
    const websiteUrl = "https://www.da.gov.ph/price-monitoring/";

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

    const newData = await page.$eval(
      "#tablepress-113 .row-striping tr td a",
      (a: HTMLAnchorElement) => ({
        pdfUrl: a.href,
        date: a.textContent?.trim() || "",
      })
    );

    await browser.close();

    const resultJson = await parseDaPdfCig(newData.pdfUrl);

    cachedResult = resultJson;
    lastFetched = now;

    return NextResponse.json(resultJson, {
      headers: {
        "Cache-Control": "s-maxage=21600, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Scraping failed:", error);

    if (cachedResult) {
      return NextResponse.json(cachedResult, {
        headers: {
          "Cache-Control": "s-maxage=21600, stale-while-revalidate=3600",
        },
      });
    }

    return NextResponse.json(
      { error: "Failed to scrape website" },
      { status: 500 }
    );
  }
}
