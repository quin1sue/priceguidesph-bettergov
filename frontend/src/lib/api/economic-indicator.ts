import type { EconomicIndicatorsType } from "@/functions/types";

const dashboardIndicators = [
  { code: "NY.GDP.PCAP.KD.ZG", category: "Economic" },
  { code: "BX.TRF.PWKR.CD.DT", category: "Economic" },
  { code: "NY.GDP.MINR.RT.ZS", category: "Economic" },
  { code: "NY.GDP.COAL.RT.ZS", category: "Economic" },
  { code: "SP.DYN.LE00.IN", category: "Social" },
  { code: "SM.POP.TOTL.ZS", category: "Social" },
  { code: "SH.H2O.BASW.ZS", category: "Social" },
  { code: "AG.LND.FRST.ZS", category: "Environment" },
  { code: "EN.GHG.CH4.WA.MT.CE.AR5", category: "Environment" },
] as const;

type ApiIndicator = Omit<EconomicIndicatorsType["result"][number], "description"> & { note?: string };
type IndicatorResponse = { success: boolean; results?: ApiIndicator[] };

export async function fetchIndicators(): Promise<EconomicIndicatorsType> {
  try {
    const results = await Promise.all(
      dashboardIndicators.map(async ({ code, category }) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/economic-indicator?indicator=${encodeURIComponent(code)}`,
          { next: { revalidate: 3600 } },
        );
        if (!response.ok) return null;
        const json = await response.json() as IndicatorResponse;
        const indicator = json.results?.[0];
        return indicator ? { ...indicator, category, description: indicator.note ?? "" } : null;
      }),
    );

    const data = results.filter((indicator): indicator is NonNullable<typeof indicator> => indicator !== null);
    if (!data.length) throw new Error("No dashboard indicators returned");
    return { title: "BetterGovPh", success: true, error: "", result: data };
  } catch {
    return {
      title: "BetterGovPh",
      success: false,
      error: "Philippine economic indicators could not be loaded.",
      result: [],
    };
  }
}
