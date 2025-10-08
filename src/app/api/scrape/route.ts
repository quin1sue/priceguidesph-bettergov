import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

export async function GET(_req: NextRequest) {
  try {
    const websiteUrl = "https://www.da.gov.ph/price-monitoring/";

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
      ], //reqrd for vercel..
    });

    const page = await browser.newPage();
    await page.goto(websiteUrl, { waitUntil: "networkidle2" });

    const newData: { date: string; pdfUrl: string }[] = await page.$$eval(
      ".column-1",
      (items) => {
        return items.map((item) => {
          const dateEl = item.querySelector("a");
          const pdfEl = item.querySelector("a") as HTMLAnchorElement | null;

          return {
            date: dateEl?.textContent?.trim() || "",
            pdfUrl: pdfEl?.href || "",
          };
        });
      }
    );

    await browser.close();

    const filePath = path.join(process.cwd(), "app", "cache", "latest.json"); //reads json file path
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    let existingData: { date: string; pdfUrl: string }[] = [];
    if (fs.existsSync(filePath)) {
      existingData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    // Merge new data with old, avoiding duplicates by PDF URL
    const mergedData = [
      ...existingData,
      ...newData.filter(
        (d) => !existingData.some((e) => e.pdfUrl === d.pdfUrl)
      ),
    ];

    // not saving it to json yet..
    // fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2));

    return NextResponse.json(mergedData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to scrape website" },
      { status: 500 }
    );
  }
}
