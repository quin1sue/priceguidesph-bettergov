import { D1Database } from "@cloudflare/workers-types";
import { parseMarketPdf } from "../../../services/functions/market index/pdf/parsePdfMarket";
import * as cheerio from "cheerio";
import { MarketCommodity } from "../../types/market-types";

export async function insertMarketData(db: D1Database) {
  const url = "https://www.da.gov.ph/price-monitoring/";
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch DA page");
  const html = await response.text();
  const $ = cheerio.load(html);
  const element = $("#tablepress-112 .row-striping tr td a");
  const latestElement = element.first();
  const pdfDate = latestElement.text().trim();
  const latestHref = latestElement.attr("href") as string;

  //checks duplicates
  const existing = await db
    .prepare(`SELECT id FROM PriceGroup WHERE date = ? AND category = ?`)
    .bind(pdfDate, "market")
    .first();

  if (existing) {
    return {
      success: false,
      message: "Data already exists for this date",
      date: pdfDate,
    };
  }
  const commodities: MarketCommodity[] = await parseMarketPdf(latestHref);

  const groupId = crypto.randomUUID();
  await db
    .prepare(`INSERT INTO PriceGroup (id, date, category) VALUES (?, ?, ?)`)
    .bind(groupId, pdfDate, "market")
    .run();

  for (const commodity of commodities) {
    const commodityId = crypto.randomUUID();
    await db
      .prepare(
        `INSERT INTO PriceCommodity (id, group_id, commodity) VALUES (?, ?, ?)`
      )
      .bind(commodityId, groupId, commodity.commodity)
      .run();

    for (const item of commodity.items) {
      await db
        .prepare(
          `INSERT INTO PriceItem (id, commodity_id, specification, price) VALUES (?, ?, ?, ?)`
        )
        .bind(crypto.randomUUID(), commodityId, item.specification, item.price)
        .run();
    }
  }

  return { success: true, date: pdfDate, totalCommodities: commodities.length };
}
