"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { EconomicIndicatorsType } from "@/functions/types"
import FullPageLoader from "@/components/custom/global/FullPageLoader";

const IndicatorContext = createContext<EconomicIndicatorsType | undefined>(undefined);

export const IndicatorProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<EconomicIndicatorsType | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIndicator = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/economic-indicator/list`,
          {
            method: "GET",
            next: { revalidate: 31536000 },
          }
        );

        if (!response.ok) {
          setData({
            success: false,
            error: "Server Error Occured",
          } as EconomicIndicatorsType);
          return;
        }

        const result = await response.json();
        setData(result);
      } catch (err: unknown) {
        console.error("Server Error Occured:", err);
        setData({
          success: false,
          error: "Server Error Occured",
        } as EconomicIndicatorsType);
      } finally {
        setLoading(false);
      }
    };
    fetchIndicator();
  }, []);

  return (
    <IndicatorContext.Provider value={data}>
      {/* Always render provider; children only when data is ready */}
      {isLoading || !data ? <FullPageLoader /> : children}
    </IndicatorContext.Provider>
  );
};



export const useIndicators = () => {
    const context = useContext(IndicatorContext);
    if (context === undefined) {
        throw new Error("useIndicator must be used within IndicatorProvider");
    }

    return context
}
