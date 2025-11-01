"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type MiniLineChartProps = {
  data: { year: number; value: number }[];
};

export function MiniLineChart({ data }: MiniLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart data={data}>
        <XAxis
          dataKey="year"
          tick={{ fontSize: 10 }}
          interval="preserveStartEnd"
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
