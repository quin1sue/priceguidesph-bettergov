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
      <h2 className="mb-4 border-l-4 border-blue-700 pl-3 text-lg font-bold text-slate-950">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {indicators.map((indicator, index) => {
          const { value: recentValue, year: recentYear } = getMostRecentValue(indicator.data);

          return (
            <article
              key={index}
              className="flex min-h-48 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3>
                <Link href={`indicator/${indicator.slug}`} className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:text-blue-800">
                  {indicator.indicatorName}
                </Link>
              </h3>
              <p className="mb-3 mt-3 line-clamp-3 text-sm leading-5 text-slate-600">{indicator.description}</p>
              <section className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <p className="text-sm font-semibold text-blue-800"><span className="font-normal text-slate-600">Latest:</span> {recentValue}</p>
                <p className="text-xs text-slate-500">{recentYear}</p>
              </section>
              {index < 2 ? (
                <section className="mt-3 h-20" aria-label={`Trend preview for ${indicator.indicatorName}`}>
                  <MiniLineChart data={indicator.data} />
                </section>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
