import * as cheerio from "cheerio";

async function testScraper() {
  const url = "https://www.da.gov.ph/price-monitoring/";
  console.log(`Fetching ${url} ...`);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    console.log(`Status Code: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch DA page with status ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const element = $("#tablepress-233 .row-striping tr td a");
    const latestElement = element.first();

    if (!latestElement.length) {
      console.warn(
        "selector found 0 matching elements. The table ID or DOM structure might have changed",
      );
      return;
    }

    const pdfDate = latestElement.text().trim();
    const latestHref = latestElement.attr("href") as string;

    console.log(`pdfdate: ${pdfDate}`);
    console.log(`href: ${latestHref}`);
  } catch (error) {
    console.error("scraper test failed:", error);
  }
}

testScraper();
