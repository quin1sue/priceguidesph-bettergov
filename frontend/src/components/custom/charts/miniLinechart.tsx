"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

type MiniLineChartProps = {
  data: { year: number; value: number }[];
};

export function MiniLineChart({ data }: MiniLineChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const chartData = data.filter((item) => Number.isFinite(item.value));
  if (!chartData.length) return <p className="text-xs text-slate-500">Trend data unavailable.</p>;
  if (!isMounted) return <p className="h-full text-xs text-slate-500">Loading trend preview…</p>;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} accessibilityLayer>
        <XAxis
          dataKey="year"
          tick={{ fontSize: 10 }}
          interval="preserveStartEnd"
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          labelFormatter={(year) => `Year: ${year}`}
          formatter={(value) => [String(value), "Value"]}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#1d4ed8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
