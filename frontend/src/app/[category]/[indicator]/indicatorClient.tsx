"use client";

import { NotFound } from "@/components/custom/dashboard/category-notfound";
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
  const sortedData = [...data].sort((a, b) => a.year - b.year);

  return (
    <main className="w-full p-6 space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-2xl font-semibold">{indicatorName}</h1>
        <p className="text-gray-500">{country}</p>
        {note && <p className="text-sm text-gray-400 mt-2">{note}</p>}
        {organization && (
          <p className="text-xs text-gray-400 mt-1 italic">{organization}</p>
        )}
      </section>

      {/* Chart */}
      <section className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0ea5e9"
              strokeWidth={2}
              name="Value"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </section>

      {/* Attribution for World Bank */}
      <section className="text-center text-xs sm:text-sm text-gray-500 mt-4">
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
      </section>
    </main>
  );
}
