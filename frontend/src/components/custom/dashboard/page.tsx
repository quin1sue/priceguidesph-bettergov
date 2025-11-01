"use client";

import { useState, useMemo } from "react";
import { CategorySection } from "./categorysection";
import { EconomicIndicatorsType } from "@/functions/types";

type Props = {
  initialData: EconomicIndicatorsType;
};

export default function DashboardPage({ initialData }: Props) {
  const [data] = useState(initialData.result);

  const grouped = useMemo(() => {
    return {
      Economic: data.filter((d) => d.category === "Economic").slice(0, 9),
      Social: data.filter((d) => d.category === "Social").slice(0, 9),
      Environment: data.filter((d) => d.category === "Environment").slice(0, 9),
    };
  }, [data]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Philippine Indicators</h1>

      <CategorySection title="Economic Indicators" indicators={grouped.Economic} />
      <CategorySection title="Social Indicators" indicators={grouped.Social} />
      <CategorySection title="Environmental Indicators" indicators={grouped.Environment} />

      <p className="mt-6 text-sm text-blue-700 px-3 py-2 rounded-lg text-center">
        Showing 10 items per category out of 1,500+ total indicators.  
        Try searching or filtering to explore more.
      </p>
    </main>
  );
}