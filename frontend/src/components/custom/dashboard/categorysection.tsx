import Link from "next/link";
import { MiniLineChart } from "../charts/miniLinechart";
import { EconomicIndicatorsType } from "@/functions/types";

type Props = {
  title: string;
  indicators: EconomicIndicatorsType["result"];
};

// get most recent non-zero value
function getMostRecentValue(data: { year: number; value: number }[]) {
  const sorted = [...data].sort((a, b) => b.year - a.year);
  const recent = sorted.find((item) => item.value !== 0);
  return recent ?? { year: sorted[0].year, value: 0 };
}

export function CategorySection({ title, indicators }: Props) {
  if (indicators.length === 0) return null;

  return (
    <section className="my-10">
      <h2 className="text-lg font-bold mb-4 border-l-4 border-blue-500 pl-2">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {indicators.map((indicator, index) => {
          const { value: recentValue, year: recentYear } = getMostRecentValue(indicator.data);

          return (
            <main
              key={index}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              <Link href={`indicator/${indicator.slug}`} className="font-medium underline text-sm text-gray-700 mb-4">{indicator.indicatorName}</Link>
              <p className="text-xs text-gray-700 mb-3 line-clamp-3">{indicator.description}</p>
              <section className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-blue-600"><span className="text-gray-700">Recent Value:</span> {recentValue}</p>
                <p className="text-xs text-gray-400">{recentYear}</p>
              </section>
              <section className="overflow-x-auto">
                <article style={{ minWidth: 300 }}>
                  <MiniLineChart data={indicator.data} />
                </article>
              </section>
            </main>
          );
        })}
      </div>
    </section>
  );
}
