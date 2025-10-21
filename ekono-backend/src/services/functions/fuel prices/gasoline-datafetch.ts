import * as cheerio from "cheerio";

type RowData = {
  specification: string;
  value: string;
};

type ScrapedData = {
  description: string;
  date: string;
  analytics: RowData[];
  generalInfo: RowData[];
  gasolinePricesPHP: RowData[];
};

let cachedResult: ScrapedData | null = null;
let lastFetched: number | null = null;
const CACHE_DURATION = 1000 * 60 * 15;

export async function scrapeGasolinePrices(): Promise<ScrapedData> {
  const now = Date.now();

  // Return cached result if still valid
  if (cachedResult && lastFetched && now - lastFetched < CACHE_DURATION) {
    return cachedResult;
  }

  try {
    const websiteUrl =
      "https://www.globalpetrolprices.com/Philippines/gasoline_prices/";

    const response = await fetch(websiteUrl, {
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
     const gasolinePricesPHP: RowData[] = [];
    const analytics: RowData[] = []
     // first table 'general info'
     const generalTable = tables.eq(0);
     generalTable.find("tbody tr").each((_, row) => {
       const cells = $(row).find("td");
       const specification = $(cells[0]).text().trim();
       const value = $(cells[1]).text().trim();
       if (specification && value) generalInfo.push({ specification, value });
     });
   
     // second table to organize 'PricesPHP'
     const phpTable = tables.eq(1);
     phpTable.find("tbody tr").each((_, row) => {
       const cells = $(row).find("td");
       const specification = $(cells[0]).text().trim();
       const value = $(cells[1]).text().trim();
       if (specification && value) gasolinePricesPHP.push({ specification, value });
     });
   

  const analyticsTable = tables.eq(2);
     analyticsTable.find("tbody tr").each((_, row) => {
       const cells = $(row).find("td");
       const specification = $(cells[0]).text().trim();
       const value = $(cells[1]).text().trim();
       if (specification && value) analytics.push({ specification, value });
     });
    const result: ScrapedData = {
      description,
      date,
      analytics,
      generalInfo,
      gasolinePricesPHP,
    };

    // Update cache
    cachedResult = result;
    lastFetched = now;

    return result;
  } catch (error) {
    console.error("Scraping failed:", error);

    // Return cached result if available, otherwise throw
    if (cachedResult) {
      return cachedResult;
    }

    throw new Error("Failed to scrape website and no cache available");
  }
}
