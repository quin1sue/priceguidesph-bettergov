"use client";

import { useEffect, useState } from "react";
import { ElectricityPriceData } from "@/functions/types";
import { TableSkeleton } from "../global/skeleton";

export function ElectricityDataTable() {
  const [data, setData] = useState<ElectricityPriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchElectricityData() {
      const res = await fetch("/api/electricity-kwh");
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    fetchElectricityData();
  }, []);

  if (loading) return <TableSkeleton />;
  if (data?.error) return <p className="text-red-500">{data.error}</p>;

  return (
    <main className="space-y-6 overflow-y-auto h-[calc(100vh-5em)] p-4">
      <header className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <p className="text-sm text-gray-700">
          {data?.metadata.description}{" "}
          <a
            className="underline font-semibold text-blue-700"
            href="https://www.globalpetrolprices.com/data_electricity_download.php"
            target="_blank"
          >
            Here
          </a>
        </p>
        <p className="mt-2">
          Source&#58;{" "}
          <a
            className="underline font-semibold text-blue-700"
            href="https://www.globalpetrolprices.com/Philippines/electricity_prices/"
            target="_blank"
          >
            globalpetrolprices.com
          </a>
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-2 text-gray-900">
          Electricity Prices
        </h2>
        <table className="w-full border border-gray-300 rounded-lg">
          <tbody>
            {data?.prices.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="p-2 font-medium">{item.what}</td>
                <td className="p-2">{item.value} USD per kWh</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2 text-gray-900">
          Production Sources
        </h2>
        <p className="text-sm text-gray-700 mb-2">
          Based on the United States Energy Information Administration data:
        </p>
        <table className="w-full border border-gray-300 rounded-lg">
          <tbody>
            {data?.production.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="p-2 font-medium">{item.what}</td>
                <td className="p-2">{item.value}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
