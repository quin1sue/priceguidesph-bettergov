import { D1Database } from "@cloudflare/workers-types";
import { parseDaPdfCig } from "../../../services/functions/market index/parsePdfCig";
import { MarketCommodity } from "../../types/market-types";
import * as cheerio from "cheerio";
export async function insertCigaretteData(db: D1Database) {
  const url = "https://www.da.gov.ph/price-monitoring/";
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch DA page");
  const html = await response.text();
  const $ = cheerio.load(html);
  const element = $("#tablepress-112 .row-striping tr td a");
  const latestElement = element.first();
  const pdfDate = latestElement.text().trim();
  const latestHref = latestElement.attr("href") as string;

  const commodities: MarketCommodity[] = await parseDaPdfCig(latestHref);

  // Insert a PriceGroup for cigarettes
  const groupId = crypto.randomUUID();
  await db
    .prepare(`INSERT INTO PriceGroup (id, date, category) VALUES (?, ?, ?)`)
    .bind(groupId, pdfDate, "cigarette")
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
