import { D1Database } from "@cloudflare/workers-types";
import { scrapeDieselPrices } from "../../../services/functions/fuel prices/diesel-datafetch";
import { scrapeGasolinePrices } from "../../../services/functions/fuel prices/gasoline-datafetch";
import { scrapeKerosenePrices } from "../../../services/functions/fuel prices/kerosene-datafetch";
import { ScrapedFuelData } from "../../types/petrol-types";
import { scrapeLPGPrices } from "../../../services/functions/fuel prices/lpg-datafetch";

async function insertFuelData(
  db: D1Database,
  fuelName: string,
  scraped: ScrapedFuelData,
  sections: { name: string; items: any[] }[]
) {
  const duplicate = await db
    .prepare(`SELECT id FROM FuelType WHERE date = ? AND name = ?`)
    .bind(scraped.date, fuelName)
    .first();

  if (duplicate) {
    return {
      success: false,
      message: "Data already exists for this date",
      date: scraped.date,
    };
  }
  const fuelId = crypto.randomUUID();
  await db
    .prepare(
      `INSERT INTO FuelType (id, name, description, date) VALUES (?, ?, ?, ?)`
    )
    .bind(fuelId, fuelName, scraped.description, scraped.date)
    .run();

  for (const section of sections) {
    const sectionId = crypto.randomUUID();
    await db
      .prepare(`INSERT INTO FuelSection (id, fuel_id, name) VALUES (?, ?, ?)`)
      .bind(sectionId, fuelId, section.name)
      .run();

    for (const item of section.items) {
      await db
        .prepare(
          `INSERT INTO FuelItem (id, section_id, specification, value) VALUES (?, ?, ?, ?)`
        )
        .bind(crypto.randomUUID(), sectionId, item.specification, item.value)
        .run();
    }
  }
}
export async function insertAllFuels(db: D1Database) {

  const lpg = await scrapeLPGPrices();
  await insertFuelData(db, "LPG", lpg, [
    { name: "generalInfo", items: lpg.generalInfo },
    { name: "LPGPricesPHP", items: lpg.LPGPricesPHP }
  ])
  const diesel = await scrapeDieselPrices();
  await insertFuelData(db, "Diesel", diesel, [
    { name: "analytics", items: diesel.analytics },
    { name: "generalInfo", items: diesel.generalInfo },
    { name: "dieselPricesPHP", items: diesel.dieselPricesPHP },
  ]);

  const gasoline = await scrapeGasolinePrices();
  await insertFuelData(db, "Gasoline", gasoline, [
    { name: "analytics", items: gasoline.analytics },
    { name: "generalInfo", items: gasoline.generalInfo },
    { name: "gasolinePricesPHP", items: gasoline.gasolinePricesPHP },
  ]);

  const kerosene = await scrapeKerosenePrices();
  await insertFuelData(db, "Kerosene", kerosene, [
    { name: "generalInfo", items: kerosene.generalInfo },
    { name: "kerosenePricesPHP", items: kerosene.kerosenePricesPHP },
  ]);
}
