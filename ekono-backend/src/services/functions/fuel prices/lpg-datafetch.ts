import * as cheerio from "cheerio";

type RowData = { specification: string; value: string };

type ScrapedData = {
  description: string;
  date: string;
  generalInfo: RowData[];
  LPGPricesPHP: RowData[];
};

let cachedResult: ScrapedData | null = null;
let lastFetched: number | null = null;
const CACHE_DURATION = 1000 * 60 * 15;

export async function scrapeLPGPrices(): Promise<ScrapedData> {
  const now = Date.now();
  if (cachedResult && lastFetched && now - lastFetched < CACHE_DURATION) return cachedResult;

  const url = "https://www.globalpetrolprices.com/Philippines/lpg_prices/";
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

  const html = await response.text();
  const $ = cheerio.load(html);

  const date = $("#graphPageLeft h1").text().trim();
  const description = $("meta[name=Description]").attr("content") || "";

  const tables = $("table");
  const generalInfo: RowData[] = [];
  const LPGPricesPHP: RowData[] = [];

  // first table 'general info'
  const generalTable = tables.eq(0);
  generalTable.find("tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    const specification = $(cells[0]).text().trim();
    const value = $(cells[1]).text().trim();
    if (specification && value) generalInfo.push({ specification, value });
  });

  // second table to organize 'LPGPricesPHP'
  const phpTable = tables.eq(1);
  phpTable.find("tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    const specification = $(cells[0]).text().trim();
    const value = $(cells[1]).text().trim();
    if (specification && value) LPGPricesPHP.push({ specification, value });
  });

  const result: ScrapedData = {
    description,
    date,
    generalInfo,
    LPGPricesPHP,
  };

  cachedResult = result;
  lastFetched = now;
  return result;
}
