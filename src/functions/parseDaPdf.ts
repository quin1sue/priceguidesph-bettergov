import { PDFParse } from "pdf-parse";

type Item = {
  specification: string;
  price: number | null;
};

type Commodity = {
  commodity: string;
  items: Item[];
};

export async function parseDaPdf(url: string): Promise<Commodity[]> {
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
    if (
      /^[A-Z\s]+$/.test(line) &&
      !line.includes("PREVAILING") &&
      !line.includes("COMMODITY")
    ) {
      currentCommodity = { commodity: line, items: [] };
      json.push(currentCommodity);
      continue;
    }

    const match = line.match(/^(.+?)\s+([0-9]+(?:\.[0-9]+)?|n\/a)$/i);
    if (match && currentCommodity) {
      const specification = match[1].trim();
      const price =
        match[2].toLowerCase() === "n/a" ? null : parseFloat(match[2]);
      currentCommodity.items.push({ specification, price });
    }
  }

  return json;
}
