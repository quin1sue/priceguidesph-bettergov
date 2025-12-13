"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { EconomicIndicatorsSchema } from "@/functions/zod/economic-indicator";
import type { EconomicIndicatorsType } from "@/functions/zod/economic-indicator";
import FullPageLoader from "@/components/custom/global/FullPageLoader";

type IndicatorContextValue = {
  data: EconomicIndicatorsType | null;
  isLoading: boolean;
  error: string | null;
};

const IndicatorContext = createContext<IndicatorContextValue | undefined>(
  undefined
);

export const IndicatorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<EconomicIndicatorsType | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/economic-indicator/list`,
          {
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error("Server Error");

        const json = await res.json();
        const parsed = EconomicIndicatorsSchema.parse(json);
        setData({ ...parsed, error: "" });
      } catch (err: unknown) {
        console.error("Indicator fetch failed:", err);
        setError("Server Error");
        setData({
          title: "BetterGovPh",
          success: false,
          result: [],
          error: "Server Error Occurred",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIndicators();
  }, []);

  return (
    <IndicatorContext.Provider value={{ data, isLoading, error }}>
      {isLoading ? <FullPageLoader /> : children}
    </IndicatorContext.Provider>
  );
};

export const useIndicators = () => {
  const context = useContext(IndicatorContext);
  if (!context)
    throw new Error("useIndicators must be used within IndicatorProvider");
  return context;
};
