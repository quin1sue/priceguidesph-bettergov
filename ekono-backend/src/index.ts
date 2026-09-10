import { ExecutionContext, Hono } from "hono";
import { cors } from "hono/cors";
import {
  D1Database,
  RateLimit,
  ScheduledController,
} from "@cloudflare/workers-types";
import { insertAllFuels } from "./lib/triggers/fuel-prices/diesel-triggers";
import { insertMarketData } from "./lib/triggers/market-index/market-triggers";
import { insertCigaretteData } from "./lib/triggers/market-index/cigarette-triggers";
import drugPriceJson from "./data/drugprice.json";
import { rateLimiter } from "./lib/middleware/middleware";
import {
  decodeEconomicIndicators,
  EconomicRecord,
} from "./services/functions/economic-indicators/eco-indicator";
import { cache } from "hono/cache";
import { PriceGroup } from "./lib/types/market-types";
import { FuelType, FuelSection, FuelItem } from "./lib/types/petrol-types";
import { isIsoDate } from "./lib/utils/report-date";

export type Bindings = {
  MY_DB: D1Database;
  FREE_RATE_LIMITER: RateLimit;
};

// Define Env interface incorporating both Bindings and ExecutionContext
const app = new Hono<{ Bindings: Bindings }>();

app.get(
  "*",
  cache({
    cacheName: "priceguides-cache-v2",
    cacheControl: "max-age=3600",
    cacheableStatusCodes: [200, 202],
  }),
);

app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// rate limiter
app.use("/*", rateLimiter);

// fetch format: /economic-indicator?country=PHL&indicator=SL.UEM.ADVN.ZS&year=2020
app.get("/economic-indicator", async (c) => {
  const indicator = c.req.query("indicator");
  const yearParam = c.req.query("year");
  const year = yearParam ? Number(yearParam) : undefined; // if year is not specified, all year values will be returned

  try {
    let data: EconomicRecord[] = await decodeEconomicIndicators();

    // Filter by indicator code or name
    if (indicator) {
      data = data.filter(
        (d) =>
          d.indicatorCode.toLowerCase() === indicator.toLowerCase() ||
          d.indicatorName.toLowerCase().includes(indicator.toLowerCase()),
      );
    }

    // Filter by year
    if (year) {
      data = data.map((d) => ({
        ...d,
        data: d.data.filter((y) => y.year === year),
      }));
    }

    return c.json(
      {
        count: Number(data.length),
        success: true,
        results: data,
      },
      200,
    );
  } catch (err) {
    console.error(err);
    return c.json(
      {
        count: 0,
        success: false,
        results: [],
      },
      500,
    );
  }
});

// list all
app.get("/economic-indicator/list", async (c) => {
  try {
    const data: EconomicRecord[] = await decodeEconomicIndicators();

    const list = data.map((d) => ({
      slug: d.slug,
      indicatorCode: d.indicatorCode,
      indicatorName: d.indicatorName,
      description: d.note,
      category: d.category,
      organization: d.organization,
      data: d.data.filter((y) => y.year >= 2000),
    }));

    return c.json(
      {
        title: "BetterGovPh",
        success: true,
        result: list,
      },
      200,
    );
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
    {},
  );

  return c.json(
    {
      name: "Drug Price Index",
      description: `This dataset provides up-to-date pricing information on pharmaceutical products in the Philippines, sourced from the Department of Health’s Drug Price Reference Index (DPRI). It includes detailed price ranges — Lowest, Median, and Highest — for a wide variety of drugs, covering oral tablets, injections, suspensions, and more. The DPRI serves as a reliable reference for healthcare providers, pharmacists, and consumers, helping them make informed decisions on medicine procurement and cost comparisons. All data are publicly available and maintained by the Department of Health to ensure transparency and accessibility in the pharmaceutical market.`,
      date: "Drug Price Reference Index: 2025 as of October 7, 2025",
      success: true,
      data: mapped,
    },
    202,
  );
});

// GET REQUESTS
app.get("/market", async (c) => {
  try {
    const db = c.env.MY_DB;

    const url = new URL(c.req.url);
    const category =
      url.searchParams.get("category")?.toLowerCase() || "market";
    const dateParam = url.searchParams.get("date");

    if (dateParam && !isIsoDate(dateParam)) {
      return c.json({ error: "date must use YYYY-MM-DD" }, 400);
    }

    const priceGroup = await db
      .prepare(
        dateParam
          ? `SELECT id, category, date, report_date FROM PriceGroup WHERE category = ? AND report_date = ? LIMIT 1`
          : `SELECT id, category, date, report_date FROM PriceGroup WHERE category = ? AND report_date IS NOT NULL ORDER BY report_date DESC LIMIT 1`,
      )
      .bind(...(dateParam ? [category, dateParam] : [category]))
      .first<PriceGroup>();

    if (!priceGroup?.report_date) {
      return c.json(
        {
          message: dateParam
            ? "No market data found for this report date"
            : "No market data found",
        },
        404,
      );
    }

    const dates = await db
      .prepare(
        `SELECT report_date FROM PriceGroup WHERE category = ? AND report_date IS NOT NULL ORDER BY report_date DESC`,
      )
      .bind(category)
      .all<{ report_date: string }>();
    const dateData = dates.results.map((row) => row.report_date);

    const commodities = await db
      .prepare(`SELECT id, commodity FROM PriceCommodity WHERE group_id = ?`)
      .bind(priceGroup.id)
      .all();

    const commoditiesWithItems = await Promise.all(
      commodities.results.map(async (commodity) => {
        const items = await db
          .prepare(
            `SELECT specification, price FROM PriceItem WHERE commodity_id = ?`,
          )
          .bind(commodity.id)
          .all();
        return { ...commodity, items: items.results };
      }),
    );

    return c.json(
      {
        success: true,
        name: category === "market" ? "Market Price" : "Cigarette Price",
        description: `DA Price Monitoring report: ${category} prices as of ${priceGroup.date}`,
        date: priceGroup.report_date,
        reportDate: priceGroup.report_date,
        sourceDate: priceGroup.date,
        dateData,
        commodities: commoditiesWithItems,
      },
      200,
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
    const namePetrol = url.searchParams.get("category") || "Kerosene";
    const dateParam = url.searchParams.get("date");
    if (dateParam && !isIsoDate(dateParam)) {
      return c.json({ error: "date must use YYYY-MM-DD" }, 400);
    }

    const fuelType = await db
      .prepare(
        dateParam
          ? `SELECT id, name, description, date, report_date FROM FuelType WHERE name = ? AND report_date = ? LIMIT 1`
          : `SELECT id, name, description, date, report_date FROM FuelType WHERE name = ? AND report_date IS NOT NULL ORDER BY report_date DESC LIMIT 1`,
      )
      .bind(...(dateParam ? [namePetrol, dateParam] : [namePetrol]))
      .first<FuelType>();

    if (!fuelType?.report_date) {
      return c.json(
        {
          message: dateParam
            ? "No fuel data found for this report date"
            : "No fuel data found",
        },
        404,
      );
    }

    const dates = await db
      .prepare(
        `SELECT report_date FROM FuelType WHERE name = ? AND report_date IS NOT NULL ORDER BY report_date DESC`,
      )
      .bind(namePetrol)
      .all<{ report_date: string }>();
    const dateData = dates.results.map((row) => row.report_date);

    const sectionsResult = await db
      .prepare(`SELECT id, name FROM FuelSection WHERE fuel_id = ?`)
      .bind(fuelType.id)
      .all<FuelSection>();

    const sections = await Promise.all(
      sectionsResult.results.map(async (section) => {
        const itemsResult = await db
          .prepare(
            `SELECT specification, value FROM FuelItem WHERE section_id = ?`,
          )
          .bind(section.id)
          .all<FuelItem>();

        return {
          ...section,
          items: itemsResult.results,
        };
      }),
    );

    return c.json(
      {
        success: true,
        id: fuelType.id,
        name: fuelType.name,
        description: fuelType.description,
        date: fuelType.report_date,
        reportDate: fuelType.report_date,
        sourceDate: fuelType.date,
        dateData,
        sections,
      },
      200,
    );
  } catch (error) {
    console.error("An error has occurred: ", error);
    return c.json({ error: "Failed to fetch fuel data" }, 500);
  }
});

// BN PRICES
app.get("/bn-prices/dates", async (c) => {
  try {
    const db = c.env.MY_DB;
    const dates = await db
      .prepare(`SELECT DISTINCT report_period FROM MonthlyBnPrice ORDER BY report_period DESC`)
      .all<{ report_period: string }>();
    return c.json({ success: true, dates: dates.results.map((r) => r.report_period) }, 200);
  } catch (error) {
    console.error("Failed to fetch BN dates: ", error);
    return c.json({ error: "Failed to fetch BN dates" }, 500);
  }
});

app.get("/bn-prices", async (c) => {
  try {
    const db = c.env.MY_DB;
    const url = new URL(c.req.url);
    const dateParam = url.searchParams.get("date");
    
    if (dateParam && !isIsoDate(dateParam)) {
      return c.json({ error: "date must use YYYY-MM-DD" }, 400);
    }
    
    let reportPeriod = dateParam;
    
    if (!reportPeriod) {
      const latest = await db.prepare(`SELECT report_period FROM MonthlyBnPrice ORDER BY report_period DESC LIMIT 1`).first<{ report_period: string }>();
      if (!latest) {
        return c.json({ message: "No BN data found" }, 404);
      }
      reportPeriod = latest.report_period;
    }
    
    const exists = await db.prepare(`SELECT report_period, previous_period, three_months_ago_period, source FROM MonthlyBnPrice WHERE report_period = ? LIMIT 1`)
      .bind(reportPeriod)
      .first<{ report_period: string, previous_period: string | null, three_months_ago_period: string | null, source: string }>();
      
    if (!exists) {
      return c.json({ message: "No BN data found for this report date" }, 404);
    }
    
    const records = await db.prepare(`
      SELECT 
        id, product_category, commodity, brand_name, specification, srp, current_price, previous_month_price, month_change_percent, month_change_php, three_months_ago_price, three_month_change_percent, three_month_change_php
      FROM MonthlyBnPrice 
      WHERE report_period = ?
      ORDER BY product_category ASC, commodity ASC, brand_name ASC
    `).bind(reportPeriod).all();
    
    const categoriesMap = new Map();
    
    for (const row of records.results) {
       const catName = row.product_category as string;
       if (!categoriesMap.has(catName)) {
         categoriesMap.set(catName, { category: catName, commodities: new Map() });
       }
       
       const cat = categoriesMap.get(catName);
       const commName = row.commodity as string;
       
       if (!cat.commodities.has(commName)) {
         cat.commodities.set(commName, { commodity: commName, items: [] });
       }
       
       cat.commodities.get(commName).items.push(row);
    }
    
    const categories = Array.from(categoriesMap.values()).map((c: any) => ({
      category: c.category,
      commodities: Array.from(c.commodities.values())
    }));
    
    const datesResult = await db.prepare(`SELECT DISTINCT report_period FROM MonthlyBnPrice ORDER BY report_period DESC`).all<{ report_period: string }>();
    const dateData = datesResult.results.map((r) => r.report_period);

    return c.json({
      success: true,
      name: "Basic Necessities",
      description: "Department of Trade and Industry monitored prevailing prices for Basic Necessities (BN) in the National Capital Region.",
      date: exists.report_period,
      reportDate: exists.report_period,
      previousPeriod: exists.previous_period,
      threeMonthsAgoPeriod: exists.three_months_ago_period,
      source: exists.source,
      dateData,
      categories
    }, 200);

  } catch (error) {
    console.error("Failed to fetch BN prices: ", error);
    return c.json({ error: "Failed to fetch BN prices" }, 500);
  }
});

// CONSTRUCTION MATERIALS PRICES
app.get("/construction-prices/dates", async (c) => {
  try {
    const db = c.env.MY_DB;
    const dates = await db
      .prepare(`SELECT DISTINCT report_period FROM MonthlyConstructionPrice ORDER BY report_period DESC`)
      .all<{ report_period: string }>();
    return c.json({ success: true, dates: dates.results.map((r) => r.report_period) }, 200);
  } catch (error) {
    console.error("Failed to fetch construction dates: ", error);
    return c.json({ error: "Failed to fetch construction dates" }, 500);
  }
});

app.get("/construction-prices", async (c) => {
  try {
    const db = c.env.MY_DB;
    const url = new URL(c.req.url);
    const dateParam = url.searchParams.get("date");
    const categoryParam = url.searchParams.get("category");
    const commodityParam = url.searchParams.get("commodity");
    const brandParam = url.searchParams.get("brand");
    const searchParam = url.searchParams.get("search");
    const pageParam = parseInt(url.searchParams.get("page") ?? "1", 10);
    const limitParam = parseInt(url.searchParams.get("limit") ?? "200", 10);
    const limit = Math.min(Math.max(limitParam, 1), 500);
    const offset = (Math.max(pageParam, 1) - 1) * limit;

    if (dateParam && !isIsoDate(dateParam)) {
      return c.json({ error: "date must use YYYY-MM-DD" }, 400);
    }

    let reportPeriod = dateParam;

    if (!reportPeriod) {
      const latest = await db
        .prepare(`SELECT report_period FROM MonthlyConstructionPrice ORDER BY report_period DESC LIMIT 1`)
        .first<{ report_period: string }>();
      if (!latest) return c.json({ message: "No construction data found" }, 404);
      reportPeriod = latest.report_period;
    }

    const meta = await db
      .prepare(
        `SELECT report_period, previous_period, three_months_ago_period, source
         FROM MonthlyConstructionPrice WHERE report_period = ? LIMIT 1`,
      )
      .bind(reportPeriod)
      .first<{ report_period: string; previous_period: string | null; three_months_ago_period: string | null; source: string }>();

    if (!meta) return c.json({ message: "No construction data found for this report date" }, 404);

    // Build dynamic WHERE clause for SQL-side filtering
    const conditions: string[] = ["report_period = ?"];
    const binds: (string | number)[] = [reportPeriod];

    if (categoryParam) {
      conditions.push("product_category = ?");
      binds.push(categoryParam);
    }
    if (commodityParam) {
      conditions.push("commodity = ?");
      binds.push(commodityParam);
    }
    if (brandParam) {
      conditions.push("brand_name = ?");
      binds.push(brandParam);
    }
    if (searchParam) {
      conditions.push("(product_category LIKE ? OR commodity LIKE ? OR brand_name LIKE ? OR size LIKE ?)");
      const like = `%${searchParam}%`;
      binds.push(like, like, like, like);
    }

    const where = conditions.join(" AND ");

    const countResult = await db
      .prepare(`SELECT count(*) as n FROM MonthlyConstructionPrice WHERE ${where}`)
      .bind(...binds)
      .first<{ n: number }>();
    const totalRows = countResult?.n ?? 0;

    const records = await db
      .prepare(
        `SELECT id, product_category, commodity, brand_name, unit, size,
                current_price, previous_month_price, month_change_percent, month_change_php,
                three_months_ago_price, three_month_change_percent, three_month_change_php
         FROM MonthlyConstructionPrice
         WHERE ${where}
         ORDER BY product_category ASC, commodity ASC, brand_name ASC
         LIMIT ? OFFSET ?`,
      )
      .bind(...binds, limit, offset)
      .all();

    // Group: category → commodity → items
    const categoriesMap = new Map<string, { category: string; commodities: Map<string, { commodity: string; items: unknown[] }> }>();

    for (const row of records.results) {
      const catName = row.product_category as string;
      if (!categoriesMap.has(catName)) {
        categoriesMap.set(catName, { category: catName, commodities: new Map() });
      }
      const cat = categoriesMap.get(catName)!;
      const commName = row.commodity as string;
      if (!cat.commodities.has(commName)) {
        cat.commodities.set(commName, { commodity: commName, items: [] });
      }
      cat.commodities.get(commName)!.items.push(row);
    }

    const categories = Array.from(categoriesMap.values()).map((c) => ({
      category: c.category,
      commodities: Array.from(c.commodities.values()),
    }));

    const datesResult = await db
      .prepare(`SELECT DISTINCT report_period FROM MonthlyConstructionPrice ORDER BY report_period DESC`)
      .all<{ report_period: string }>();
    const dateData = datesResult.results.map((r) => r.report_period);

    return c.json(
      {
        success: true,
        name: "Construction Materials",
        description:
          "Department of Trade and Industry monitored prevailing prices for Construction Materials in the National Capital Region.",
        date: meta.report_period,
        reportDate: meta.report_period,
        previousPeriod: meta.previous_period,
        threeMonthsAgoPeriod: meta.three_months_ago_period,
        source: meta.source,
        dateData,
        pagination: { page: pageParam, limit, total: totalRows, pages: Math.ceil(totalRows / limit) },
        categories,
      },
      200,
    );
  } catch (error) {
    console.error("Failed to fetch construction prices: ", error);
    return c.json({ error: "Failed to fetch construction prices" }, 500);
  }
});


// cron trigger scheduling and rate limiting
export default {
  fetch: app.fetch,

  async scheduled(
    controller: ScheduledController,
    env: Bindings,
    ctx: ExecutionContext,
  ) {
    const cron = controller.cron.trim();

    console.log("Cron triggered:", cron);

    const runJob = async <T>(name: string, job: () => Promise<T>) => {
      try {
        const result = await job();
        console.log(`[${name}] success`, result);
      } catch (err) {
        console.error(`[${name}] failed`, err);
      }
    };

    switch (cron) {
      case "0 0 * * 2-6":
        ctx.waitUntil(runJob("Fuel Cron", () => insertAllFuels(env.MY_DB)));
        break;

      case "0 6-8 * * *":
      case "0 6,7,8 * * *":
        ctx.waitUntil(runJob("Market Cron", () => insertMarketData(env.MY_DB)));
        break;

      case "30 7-9 * * *":
      case "30 7,8,9 * * *":
        ctx.waitUntil(
          runJob("Cigarette Cron", () => insertCigaretteData(env.MY_DB)),
        );
        break;

      default:
        console.warn("Unknown cron:", cron);
    }
  },
};
