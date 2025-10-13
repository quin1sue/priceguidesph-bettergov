import { Hono } from "hono";
import * as cheerio from "cheerio";
/*             :P              */
import { parseDaPdfCig } from "./services/functions/market index/parsePdfCig";
import { parseMarketPdf } from "./services/functions/market index/parsePdfMarket";
import { scrapeGasolinePrices } from "./services/functions/fuel prices/gasoline-datafetch";
import { scrapeDieselPrices } from "./services/functions/fuel prices/diesel-datafetch";
import { scrapeKerosenePrices } from "./services/functions/fuel prices/kerosene-datafetch";

const app = new Hono();

app.get("/cigarettes-index", async (c) => {
  const url: string = "https://www.da.gov.ph/price-monitoring/";
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const element = $("#tablepress-113 .row-striping tr td a");

    const latestElement = element.first();
    const pdfDate = latestElement.text().trim();
    const latestHref = latestElement.attr("href") as string;
    const res = await parseDaPdfCig(latestHref);
    return c.json(res);
  } catch (err) {
    console.error("an error has occured: ", err);
  }

  return c.json(["Internal Server Error 500"]);
});

app.get("/market-price-index", async (c) => {
  const url: string = "https://www.da.gov.ph/price-monitoring/";
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const element = $("#tablepress-112 .row-striping tr td a");

    const latestElement = element.first();
    const pdfDate = latestElement.text().trim();
    const latestHref = latestElement.attr("href") as string;
    const res = await parseMarketPdf(latestHref);
    return c.json({ date: pdfDate, marketPrice: res });
  } catch (err) {
    console.log("An error has occured: ", err);
  }
  return c.json(["Failed"]);
});
export default app;

app.get("/def", async (c) => {
  const url: string = "https://www.da.gov.ph/price-monitoring/";
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const element = $("#tablepress-113 .row-striping tr td a");

    const latestElement = element.first();
    const latestData = latestElement.text().trim();
    const latestHref = latestElement.attr("href");
    return c.json({ date: latestData, url: latestHref }, 200, {
      "Cache-Control": "s-maxage=900, stale-while-revalidate=300",
    });
  } catch (err) {
    console.error("an error has occured: ", err);
  }
  return c.text("hi");
});

app.get("/gasoline-prices", async (c) => {
  try {
    const data = await scrapeGasolinePrices();
    return c.json(data, 200, {
      "Cache-Control": "s-maxage=900, stale-while-revalidate=300",
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch gasoline prices" }, 500);
  }
});

app.get("/diesel-prices", async (c) => {
  try {
    const data = await scrapeDieselPrices();
    return c.json(data, 200, {
      "Cache-Control": "s-maxage=900, stale-while-revalidate=300",
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch electricity prices" }, 500);
  }
});

app.get("/kerosene-prices", async (c) => {
  try {
    const data = await scrapeKerosenePrices();
    return c.json(data, 200, {
      "Cache-Control": "s-maxage=900, stale-while-revalidate=300",
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch electricity prices" }, 500);
  }
});
