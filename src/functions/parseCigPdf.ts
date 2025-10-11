import { PDFParse } from "pdf-parse";

type Item = {
  brandName: string;
  price: number | string;
};

type Commodity = {
  commodity: string;
  items: Item[];
};
// pagod n ko men
export async function parseDaPdfCig(url: string): Promise<Commodity[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch PDF");
  const buffer = await response.arrayBuffer();

  const parser = new PDFParse({ data: Buffer.from(buffer) });
  const textResult = await parser.getText();
  await parser.destroy();

  const text = textResult.text;

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const json: Commodity[] = [];
  let currentCommodity: Commodity | null = null;

  for (const line of lines) {
    if (/^Page \d+ of \d+/i.test(line)) continue;

    if (
      /^[A-Z\s]+$/.test(line) &&
      !line.includes("BRAND NAME/VARIANT") &&
      !line.includes("SPECIFICATION")
    ) {
      currentCommodity = { commodity: line, items: [] };
      json.push(currentCommodity);
      continue;
    }

    const match = line.match(/^(.+?)\s+([0-9]+(?:\.[0-9]+)?|n\/a)$/i);
    if (match && currentCommodity) {
      const brandName = match[1].trim();
      const price =
        match[2].toLowerCase() === "n/a" ? "n/a" : parseFloat(match[2]);

      if (
        brandName &&
        !/^pack \(\d+ sticks per pack\)$/i.test(brandName) &&
        !/^Page \d+ of \d+/i.test(brandName)
      ) {
        currentCommodity.items.push({ brandName, price });
      }
    }
  }

  return json;
}
