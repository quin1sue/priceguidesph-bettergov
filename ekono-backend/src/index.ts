import { ExecutionContext, Hono } from "hono";
import { cors } from "hono/cors";
import * as cheerio from "cheerio";
import { parseDaPdfCig } from "./services/functions/market index/parsePdfCig";
import { parseMarketPdf } from "./services/functions/market index/parsePdfMarket";
import { scrapeGasolinePrices } from "./services/functions/fuel prices/gasoline-datafetch";
import { scrapeDieselPrices } from "./services/functions/fuel prices/diesel-datafetch";
import { scrapeKerosenePrices } from "./services/functions/fuel prices/kerosene-datafetch";
import { D1Database, ScheduledController } from "@cloudflare/workers-types";
import { insertAllFuels } from "./lib/triggers/fuel-prices/diesel-triggers";
import { insertMarketData } from "./lib/triggers/market-index/market-triggers";
import { insertCigaretteData } from "./lib/triggers/market-index/cigarette-triggers";

export type Bindings = {
  MY_DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

//apply CORS
app.use(
  "/*",
  cors({
    origin: [
      "production url",
      "http://localhost:3000", // locally
    ], //frontend domain
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// GET REQUESTS
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
    return c.json({ date: pdfDate, category: "cigarette", commodities: res });
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
    return c.json({ date: pdfDate, category: "market", commodities: res });
  } catch (err) {
    console.log("An error has occured: ", err);
  }
  return c.json(["Failed"]);
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

// cron trigger scheduling
export default {
  fetch: app.fetch,
  async scheduled(
    controller: ScheduledController,
    env: Bindings,
    ctx: ExecutionContext
  ) {
    switch (controller.cron) {
      case "0 0 * * 2":
        ctx.waitUntil(insertAllFuels(env.MY_DB));
        break;
      case "0 15 * * *":
        ctx.waitUntil(
          (async () => {
            try {
              await insertAllFuels(env.MY_DB);
              console.log("Fuel data inserted successfully");
            } catch (err) {
              console.error("Fuel cron failed:", err);
            }
          })()
        );
        break;
      case "15 14 * * *":
        ctx.waitUntil(
          (async () => {
            try {
              await insertMarketData(env.MY_DB);
              console.log("Market data inserted successfully");
            } catch (err) {
              console.error("Market cron failed:", err);
            }
          })()
        );
        break;
      case "0 14 * * *":
        ctx.waitUntil(
          (async () => {
            try {
              await insertCigaretteData(env.MY_DB);
              console.log("Cigarette data inserted successfully");
            } catch (err) {
              console.error("Cigarette cron failed:", err);
            }
          })()
        );
        break;

      default:
        console.log("no matching cron for: ", controller.cron);
    }
  },
};
