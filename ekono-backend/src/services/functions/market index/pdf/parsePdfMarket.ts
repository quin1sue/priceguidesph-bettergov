import { getDocument } from "pdfjs-serverless";
import { MarketCommodity } from "../../../../lib/types/market-types"; 

type Item = {
  specification: string;
  price: number;
};

type Commodity = {
  commodity: string;
  items: Item[];
};

export async function parseMarketPdf(url: string): Promise<MarketCommodity[]> {
  // fetch PDF from URL
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch PDF");
  const arrayBuffer = await response.arrayBuffer();

  const pdf = await getDocument({
    data: new Uint8Array(arrayBuffer),
    standardFontDataUrl:
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/",
    useSystemFonts: false,
  }).promise;

  let allLines: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const rows: Map<number, any[]> = new Map();

    for (const item of content.items) {
      const y = Math.round((item as any).transform[5]); // Y position
      if (!rows.has(y)) {
        rows.set(y, []);
      }
      rows.get(y)!.push(item);
    }

    const sortedRows = Array.from(rows.entries()).sort((a, b) => b[0] - a[0]);
    for (const [_, items] of sortedRows) {
      const sortedItems = items.sort(
        (a: any, b: any) => a.transform[4] - b.transform[4]
      );
      const lineText = sortedItems.map((item: any) => item.str).join(" ");
      if (lineText.trim()) {
        allLines.push(lineText.trim());
      }
    }
  }

  const json: MarketCommodity[] = [];
  let currentCommodity: Commodity | null = null;

  for (const line of allLines) {
    //skip page numbers and headers
    if (/^Page\s+\d+\s+of\s+\d+$/i.test(line)) continue;

    //detect commodity names (all uppercase, no special patterns)
    if (
      /^[A-Z\s]+$/.test(line) &&
      !line.includes("PREVAILING") &&
      !line.includes("COMMODITY") &&
      !line.includes("SPECIFICATION") &&
      !line.includes("PRICE") &&
      line.length > 3
    ) {
      currentCommodity = { commodity: line, items: [] };
      json.push(currentCommodity);
      continue;
    }

    //deteCt item + price lines
    const match = line.match(/^(.+?)\s+([0-9]+(?:\.[0-9]{2})?|n\/a)$/i);
    if (match && currentCommodity) {
      const specification = match[1].trim();

      //skips if it has a "Page of *" value.
      if (/^Page\s+\d+\s+of$/i.test(specification)) continue;

      const price =
        match[2].toLowerCase() === "n/a" ? "n/a" : parseFloat(match[2]);
      if (price === "n/a") continue;
      currentCommodity.items.push({ specification, price });
    }
  }

  return json;
}
