import {  ExecutionContext, Hono  } from "hono";
import { cors } from "hono/cors";
import { D1Database, RateLimit, ScheduledController } from "@cloudflare/workers-types";
import { insertAllFuels } from "./lib/triggers/fuel-prices/diesel-triggers";
import { insertMarketData } from "./lib/triggers/market-index/market-triggers";
import { insertCigaretteData } from "./lib/triggers/market-index/cigarette-triggers";
import drugPriceJson from "./data/drugprice.json";
import { rateLimiter } from "./lib/middleware/middleware";
import { decodeEconomicIndicators, EconomicRecord } from "./services/functions/economic-indicators/eco-indicator";
import { cache } from "hono/cache";
import { PriceGroup } from "./lib/types/market-types";
import { FuelType, FuelSection, FuelItem } from "./lib/types/petrol-types";
export type Bindings = {
  MY_DB: D1Database;
  FREE_RATE_LIMITER: RateLimit
};

const app = new Hono<{ Bindings: Bindings }>();


// caching
app.get("*",
  cache({
    cacheName: "priceguides-cache",
    cacheControl: 'max-age=3600',
    cacheableStatusCodes: [ 202, 200 ] // for static data json/csv 
  })
)
//apply CORS
app.use(
  "/*",
  cors({
    origin: '*',
    allowMethods: ["GET"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// rate limiter
app.use("/*", rateLimiter)


// fetch format: /economic-indicator?country=PHL&indicator=SL.UEM.ADVN.ZS&year=2020
app.get("/economic-indicator", async (c) => {  
  const country = c.req.query("country");
  const indicator = c.req.query("indicator");
  const yearParam = c.req.query("year");
  const year = yearParam ? Number(yearParam) : undefined; // if year is not specified, all year values will be returned

  try {
    let data: EconomicRecord[] = await decodeEconomicIndicators();

    // Filter by country
    if (country) {
      data = data.filter(
        (d) => d.countryCode.toLowerCase() === country.toLowerCase()
      );
    }

    // Filter by indicator code or name
    if (indicator) {
      data = data.filter(
        (d) =>
          d.indicatorCode.toLowerCase() === indicator.toLowerCase() ||
          d.indicatorName.toLowerCase().includes(indicator.toLowerCase())
      );
    }

    // Filter by year
    if (year) {
      data = data.map((d) => ({
        ...d,
        data: d.data.filter((y) => y.year === year),
      }));
    }

    return c.json({
      count: data.length,
      success: true,
      results: data,
    }, 200);
  } catch (err) {
    console.error(err);
    return c.text("Failed to fetch economic indicators", 500);
  }
});

// list all
app.get("/economic-indicator/list", async (c) => {
  try {
    const data: EconomicRecord[] = await decodeEconomicIndicators();

    // Map to include slug, code, name, metadata, and filtered yearly data
    const list = data.map((d) => ({
      slug: d.slug,
      indicatorCode: d.indicatorCode,
      indicatorName: d.indicatorName,
      description: d.note,
      category: d.category,
      organization: d.organization,
      // filter 2000 to current data
      data: d.data.filter((y) => y.year >= 2000),
    }));

    return c.json({
      title: "BetterGovPh", success: true, result: list}, 200);
  } catch (err) {
    console.error(err);
    return c.text("Failed to fetch indicator list", 500);
  }
});

app.get("/drugprice", async (c) => {
  // group by first word of the DrugName
  const mapped = drugPriceJson.reduce<Record<string, typeof drugPriceJson>>(
    (acc, drug) => {
      if (!drug.DrugName) return acc;
      const key = drug.DrugName.split(" ")[0];
      if (!acc[key]) acc[key] = [];
      acc[key].push(drug);
      return acc;
    },
    {}
  );

  return c.json({
    name: "Drug Price Index", description: `This dataset provides up-to-date pricing information on pharmaceutical products in the Philippines, sourced from the Department of Health’s Drug Price Reference Index (DPRI). It includes detailed price ranges — Lowest, Median, and Highest — for a wide variety of drugs, covering oral tablets, injections, suspensions, and more. The DPRI serves as a reliable reference for healthcare providers, pharmacists, and consumers, helping them make informed decisions on medicine procurement and cost comparisons. All data are publicly available and maintained by the Department of Health to ensure transparency and accessibility in the pharmaceutical market.`,
    date: "Drug Price Reference Index: 2025 as of October 7, 2025",
    success: true,
    data: mapped,
   }, 202);
});

// GET REQUESTS
app.get("/market", async (c) => {
  try {
    const db = c.env.MY_DB;

    const url = new URL(c.req.url);
    const category = url.searchParams.get("category")?.toLowerCase() || "market";
    const dateParam = url.searchParams.get("date");

    const priceGroups = await db
      .prepare(`SELECT * FROM PriceGroup WHERE category = ?`)
      .bind(category)
      .all<PriceGroup>();

    if (!priceGroups.results.length) {
      return c.json({ message: "No market data found" }, 404);
    }

    const sortedGroups = priceGroups.results.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()

    );

    let priceGroup;

    if (dateParam) {
      // If user specifies a date, pick the latest record before or on that date
      const targetDate = new Date(dateParam);
      priceGroup = sortedGroups.find(g => new Date(g.date) <= targetDate) || sortedGroups[0];
    } else {
      // Otherwise just take the latest record
      priceGroup = sortedGroups[0];
    }

    // Get all available dates sorted chronologically (latest first)
    const dateData = sortedGroups.map(g => g.date);

    const commodities = await db
      .prepare(`SELECT id, commodity FROM PriceCommodity WHERE group_id = ?`)
      .bind(priceGroup.id)
      .all();

      const commoditiesWithItems = await Promise.all(
      commodities.results.map(async (commodity) => {
        const items = await db
          .prepare(`SELECT specification, price FROM PriceItem WHERE commodity_id = ?`)
          .bind(commodity.id)
          .all();
        return { ...commodity, items: items.results };
      })
    );

    return c.json(
      {
        success: true,
        name: category === "market" ? "Market Price" : "Cigarette Price",
        description: `DA Price Monitoring report: latest ${category} prices as of ${priceGroup.date}`,
        date: priceGroup.date,
        dateData,
        commodities: commoditiesWithItems,
      },
      200
    );
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch market data" }, 500);
  }
});




// KEROSENE, DIESEL, GASOLINE PETROL RELATED DATA
app.get("/fuel-prices", async (c) => {
  try {
    const db = c.env.MY_DB;
    const url = new URL(c.req.url);
    const namePetrol = url.searchParams.get("category") || "Kerosene"; // default

    // Get all fuel type records
    const fuelTypes = await db
      .prepare(`SELECT * FROM FuelType WHERE name = ?`)
      .bind(namePetrol)
      .all<FuelType>();

    if (!fuelTypes.results.length) {
      return c.json([], 200);
    }

    // Sort by actual date value (newest first)
    const sortedFuelTypes = fuelTypes.results.sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Pick the most recent one
    const fuelType = sortedFuelTypes[0];

    const sectionsResult = await db
      .prepare(`SELECT id, name FROM FuelSection WHERE fuel_id = ?`)
      .bind(fuelType.id)
      .all<FuelSection>();

    const sections = await Promise.all(
      sectionsResult.results.map(async (section) => {
        const itemsResult = await db
          .prepare(
            `SELECT specification, value FROM FuelItem WHERE section_id = ?`
          )
          .bind(section.id)
          .all<FuelItem>();

        return {
          ...section,
          items: itemsResult.results,
        };
      })
    );

    return c.json(
      {
        success: true,
        ...fuelType,
        sections,
      },
      200
    );
  } catch (error) {
    console.error("An error has occurred: ", error);
    return c.json({ error: "Failed to fetch fuel data" }, 500);
  }
});


// cron trigger scheduling and rate limiting
export default {
  fetch: app.fetch,
  async scheduled(
    controller: ScheduledController,
    env: Bindings,
    ctx: ExecutionContext
  ) {
    switch (controller.cron) {
      case "0 0 * * 2-6": // runs in weekdays 12am
        ctx.waitUntil(
          (async () => {
            try {
              await insertAllFuels(env.MY_DB);
              console.log("fuel data inserted successfully");
            } catch (err) {
              console.error("fuel cron failed:", err);
            }
          })()
        );
        break;
      case "0 6-8 * * *": // runs 2pm - 5pm in GMT time
        ctx.waitUntil(
          (async () => {
            try {
              await insertMarketData(env.MY_DB);
              console.log("market data inserted successfully");
            } catch (err) {
              console.error("market cron failed:", err);
            }
          })()
        );
        break;
      case "30 7-9 * * *": // runs for every 1hr and 30mins GMT time 2:30pm to 3:
        ctx.waitUntil(
          (async () => {
            try {
              await insertCigaretteData(env.MY_DB);
              console.log("cigarettes data inserted successfully");
            } catch (err) {
              console.error("cigarettes cron failed:", err);
            }
          })()
        );
        break;

      default:
        console.log("no matching cron for: ", controller.cron);
    }
  },
}
