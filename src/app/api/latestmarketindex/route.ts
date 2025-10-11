import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { parseDaPdf } from "@/functions/parseDaPdf";
import { MainJson } from "@/functions/types";

let cache: MainJson | null = null;
let lastFetched: number | null = null;
const CACHE_DURATION = 1000 * 60 * 60 * 6;

export async function GET(_req: NextRequest) {
  const now = Date.now();

  if (cache && lastFetched && now - lastFetched < CACHE_DURATION) {
    return NextResponse.json(cache, {
      headers: {
        "Cache-Control": "s-maxage=21600, stale-while-revalidate=3600", // 6h edge cache
      },
    });
  }

  try {
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto("https://www.da.gov.ph/price-monitoring/", {
      waitUntil: "domcontentloaded",
    });

    const latest = await page.$eval(
      "#tablepress-112 .row-striping tr td a",
      (a: HTMLAnchorElement) => ({
        pdfUrl: a.href,
        date: a.textContent?.trim() || "",
      })
    );

    await browser.close();

    if (!latest.pdfUrl) {
      return NextResponse.json({ error: "No PDF found" }, { status: 404 });
    }

    const parsedPDF = await parseDaPdf(latest.pdfUrl);

    cache = {
      date: latest.date,
      parsedPDF,
    };
    lastFetched = now;

    return NextResponse.json(cache, {
      headers: {
        "Cache-Control": "s-maxage=21600, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Scraping failed:", error);

    if (cache) {
      return NextResponse.json(cache, {
        headers: {
          "Cache-Control": "s-maxage=21600, stale-while-revalidate=3600",
        },
      });
    }

    return NextResponse.json(
      { error: "Failed to scrape or parse PDF" },
      { status: 500 }
    );
  }
}
