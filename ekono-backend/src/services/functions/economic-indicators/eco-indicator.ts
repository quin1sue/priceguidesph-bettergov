import Papa from "papaparse";
import { indicatorsCsv } from "../../../data/economic-indicators";
import { metadataCsv } from "../../../metadata/metadata-economic-indicators";

// row from the main indicators CSV (dynamic keys like "1960", "1961" etc.)
type EconomicRow = Record<string, string>;

// Each row from the metadata CSV
type MetadataRow = {
  INDICATOR_CODE: string;
  INDICATOR_NAME: string;
  SOURCE_NOTE: string;
  SOURCE_ORGANIZATION: string;
};

// each yearly data point
type YearlyData = {
  year: number;
  value: number | null; // null if value is missing
};

// Metadata for a single indicator
type IndicatorMeta = {
  name: string;
  note: string;
  organization: string;
};

// Final structured object returned for each country + indicator
export type EconomicRecord = {
  slug: string;              // Unique identifier (same as indicator code)
  country: string;           // Country name
  countryCode: string;       // Country code PHL
  category: string;         // category filtering
  indicatorCode: string;     // Code for the indicator
  indicatorName: string;     // Human-readable name
  note: string;              // Notes from metadata
  organization: string;      // Source organization
  data: YearlyData[];        // Yearly values
};

let cachedData: EconomicRecord[] | null = null;
function getCategory(name: string): string {
  const lower = name.toLowerCase();

  if (lower.includes("population") || lower.includes("life expectancy") || lower.includes("poverty"))
    return "Social";

  if (lower.includes("gdp") || lower.includes("inflation") || lower.includes("remittances"))
    return "Economic";

  if (lower.includes("co2") || lower.includes("emissions") || lower.includes("forest"))
    return "Environment";

  return "Other";
}


export async function decodeEconomicIndicators(): Promise<EconomicRecord[]> {
  // Return cached data if available
  if (cachedData) return cachedData;

  const data = Papa.parse<EconomicRow>(indicatorsCsv, {
    header: true,        // Use first row as keys
    skipEmptyLines: true // Skip blank lines
  }).data;

  const metadata = Papa.parse<MetadataRow>(metadataCsv, {
    header: true,
    skipEmptyLines: true
  }).data;

  // Build a map from indicator code for metadata
  const metaMap = new Map<string, IndicatorMeta>();
  for (const m of metadata) {
    if (!m.INDICATOR_CODE) continue; // Skip invalid rows
    metaMap.set(m.INDICATOR_CODE.trim(), {
      name: m.INDICATOR_NAME?.trim() ?? "Unknown Indicator",
      note: m.SOURCE_NOTE?.trim() ?? "",
      organization: m.SOURCE_ORGANIZATION?.trim() ?? ""
    });
  }

  // Detect which columns are years
  const yearColumns = Object.keys(data[0] || {}).filter((k) => /^\d{4}$/.test(k));

  // Transform raw rows to structured EconomicRecord[]
  const decoded: EconomicRecord[] = data.map((row) => {
    const code = row["Indicator Code"]?.trim();        // Normalize indicator code
    const meta = code ? metaMap.get(code) : undefined; // Lookup metadata

    // Transform all year columns into YearlyData[]
    const yearlyData: YearlyData[] = yearColumns.map((year) => ({
      year: Number(year),
      value: row[year] ? Number(row[year]) : 0
    }));

  const nameForCategory = meta?.name ?? row["Indicator Name"] ?? "";
  const category = getCategory(nameForCategory);
    return {
      slug: code ?? "unknown",
      country: row["Country Name"]?.trim() ?? "Unknown",
      countryCode: row["Country Code"]?.trim() ?? "",
      indicatorCode: code ?? "unknown",
      indicatorName: meta?.name ?? "Unknown Indicator",
      note: meta?.note ?? "",
      category: category,
      organization: meta?.organization ?? "",
      data: yearlyData
    };
  });

  // Cache the result for future calls
  cachedData = decoded;
  return decoded;
}


// filter data
export async function filterEconomicData({
  country,
  indicator,
  year,
}: {
  country?: string;
  indicator?: string;
  year?: number;
}): Promise<EconomicRecord[]> {
  // Get all decoded data
  const data = await decodeEconomicIndicators();
  let filtered = data;

  // Filter by country code
  if (country) {
    const normalizedCountry = country.trim().toLowerCase();
    filtered = filtered.filter((d) => d.countryCode.toLowerCase() === normalizedCountry);
  }

  // Filter by indicator code or name
  if (indicator) {
    const normalizedIndicator = indicator.trim().toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.indicatorCode.toLowerCase() === normalizedIndicator ||
        d.indicatorName.toLowerCase().includes(normalizedIndicator)
    );
  }

  // filter by year
  if (year) {
    filtered = filtered.map((d) => ({
      ...d,
      data: d.data.filter((y) => y.year === year),
    }));
  }

  return filtered;
}

export async function listIndicators(): Promise<{ slug: string; name: string }[]> {
  const data = await decodeEconomicIndicators();
  const map = new Map<string, string>();
  for (const d of data) {
    if (!map.has(d.slug)) map.set(d.slug, d.indicatorName);
  }
  return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
}
