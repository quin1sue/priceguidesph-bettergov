"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  DataDetails,
  PageHeader,
} from "@/components/custom/shared/page-header";
import { EmptyState } from "@/components/custom/shared/data-state";

type IndicatorData = {
  year: number;
  value: number;
};

type IndicatorProps = {
  indicator: {
    slug: string;
    country: string;
    indicatorName: string;
    note?: string;
    organization?: string;
    data: IndicatorData[];
  };
};

export default function IndicatorClient({ indicator }: IndicatorProps) {
  const { indicatorName, country, organization, data, note } = indicator;
  const sortedData = [...data]
    .filter((item) => Number.isFinite(item.value))
    .sort((a, b) => a.year - b.year);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow={`${country} economic indicator`}
        title={indicatorName}
        description={
          note || "Historical data for this Philippine economic indicator."
        }
      />

      <DataDetails source={{ name: organization || "World Bank" }}>
        Values are shown by year. Definitions and methodologies are provided by
        the source.
      </DataDetails>

      {sortedData.length ? (
        <section
          className="relative h-80 w-full min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:h-96 sm:p-5"
          aria-label={`Historical chart for ${indicatorName}`}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
          >
            <ComposedChart
              data={sortedData}
              accessibilityLayer
              margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(year) => `Year: ${year}`}
                formatter={(value) => [String(value), indicatorName]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0ea5e9"
                strokeWidth={2}
                name={indicatorName}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </section>
      ) : (
        <EmptyState
          title="No chart data available"
          description="This indicator was returned without numeric yearly values. Try another indicator or check the source later."
        />
      )}

      <footer className="border-t border-slate-200 pt-4 text-xs text-slate-600 sm:text-sm">
        <p>
          Data sourced from{" "}
          <a
            href="https://data.worldbank.org/country/philippines"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            World Bank &#8212; Philippines
          </a>
          , licensed under{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            CC BY 4.0
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
