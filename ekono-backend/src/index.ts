import { ExecutionContext, Hono } from "hono";
import { cors } from "hono/cors";
import { D1Database, D1Result, ScheduledController } from "@cloudflare/workers-types";
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
    origin: ["http://localhost:3000", // locally
    "https://price-guides.bettergov.ph"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// GET REQUESTS
app.get("/market", async (c) => {
  try {
  // get the date of the market  
  const date = new Date();
  const formattedDate = date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })


    const category = c.req.url.includes("category=")
      ? new URL(c.req.url).searchParams.get("category")
      : "market"; // default params
    const db = c.env.MY_DB;

  const dateData: D1Result<Record<string, unknown>> = await db
  .prepare(`
    SELECT date FROM PriceGroup 
    WHERE category = ?`)
    .bind(category)
    .all()

    const priceGroup = await db
      .prepare(
        `SELECT id, date, category 
         FROM PriceGroup 
         WHERE category = ? AND date <= ?
         ORDER BY date DESC 
         LIMIT 1`
      )
      .bind(category?.toLowerCase(), formattedDate)
      .first();
  
    if (!priceGroup) {
      return c.json({ message: "No market data found" }, 404);
    }

    const commodities = await db
      .prepare(
        `SELECT id, commodity 
         FROM PriceCommodity 
         WHERE group_id = ?`
      )
      .bind(priceGroup.id)
      .all();

    // for each commodity, get its items
    const commoditiesWithItems = await Promise.all(
      commodities.results.map(async (commodity: any) => {
        const items = await db
          .prepare(
            `SELECT specification, price 
             FROM PriceItem 
             WHERE commodity_id = ?`
          )
          .bind(commodity.id)
          .all();

        return {
          ...commodity,
          items: items.results,
        };
      })
    );
    
    return c.json(
      {
        dateData: dateData.results.map((date: Record<string, unknown>) => date.date ),
        name: priceGroup["category"] as string === "market" ? "Market Price" : "Cigarette Price",
        success: true,
        description: `DA Price Monitoring report: latest ${category} prices as of ${priceGroup.date}`,
        commodities: commoditiesWithItems,
      },
      200,
      {
        "Cache-Control": "s-maxage=900, stale-while-revalidate=300",
      }
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

    const fuelType = await db
      .prepare(`SELECT * FROM FuelType WHERE name = ? ORDER BY date DESC`)
      .bind(namePetrol)
      .first()
    if (!fuelType) return c.json([], 200);

    const sectionsResult = await db
      .prepare(`SELECT id, name FROM FuelSection WHERE fuel_id = ?`)
      .bind(fuelType.id)
      .all();

    const sections = await Promise.all(
      sectionsResult.results.map(async (section: any) => {
        const itemsResult = await db
          .prepare(
            `SELECT specification, value FROM FuelItem WHERE section_id = ?`
          )
          .bind(section.id)
          .all();

        return {
          ...section,
          items: itemsResult.results,
        };
      })
    );
    return c.json(
      {
        ...fuelType,
        success: true,
        sections,
      },
      200,
      {
        "Cache-Control": "s-maxage=900, stale-while-revalidate=300",
      }
    );
  } catch (error) {
    console.error("An error has occurred: ", error);
    return c.json({ error: "Failed to fetch fuel data" }, 500);
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
      case "0 0 * * 3": // tue in ph,wed in utc
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
      case "0 7 * * *": // 3pm in ph, 7am in utc 
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
      case "0 9 * * *": // 5pm in ph, 9am in utc
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
};
