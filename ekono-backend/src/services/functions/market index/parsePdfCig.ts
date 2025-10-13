import { getDocument } from "pdfjs-serverless";

type Item = {
  brandName: string;
  price: number | string;
};

type Commodity = {
  commodity: string;
  items: Item[];
};

export async function parseDaPdfCig(url: string): Promise<Commodity[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch PDF");
  const buffer = await response.arrayBuffer();

  const pdfDoc = await getDocument({
    data: new Uint8Array(buffer),
    standardFontDataUrl:
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/",
    useSystemFonts: false,
  }).promise;

  let allItems: any[] = [];

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
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

    //sort items by left to right position
    for (const [_, items] of sortedRows) {
      const sortedItems = items.sort(
        (a: any, b: any) => a.transform[4] - b.transform[4]
      );
      const lineText = sortedItems.map((item: any) => item.str).join(" ");
      if (lineText.trim()) {
        allItems.push(lineText.trim());
      }
    }
  }

  const json: Commodity[] = [];
  let currentCommodity: Commodity | null = null;

  for (const line of allItems) {
    //skip page numbers - match various formats
    if (/Page\s+\d+\s+of(\s+\d+)?/i.test(line)) continue;

    if (
      /^[A-Z\s]+$/.test(line) &&
      !line.includes("BRAND NAME") &&
      !line.includes("SPECIFICATION") &&
      !line.includes("PRICE") &&
      line.length > 3
    ) {
      currentCommodity = { commodity: line, items: [] };
      json.push(currentCommodity);
      continue;
    }

    const match = line.match(/^(.+?)\s+([0-9]+(?:\.[0-9]{2})?|n\/a)$/i);
    if (match && currentCommodity) {
      const brandName = match[1].trim();

      if (/Page\s+\d+\s+of/i.test(brandName)) continue;
      if (/^\d+\s+pack \(\d+ sticks/i.test(brandName)) continue;
      if (/^pack \(\d+ sticks/i.test(brandName)) continue;

      const price =
        match[2].toLowerCase() === "n/a" ? "n/a" : parseFloat(match[2]);

      currentCommodity.items.push({ brandName, price });
    }
  }

  return json;
}
