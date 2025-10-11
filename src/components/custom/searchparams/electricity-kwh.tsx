"use client";

import { useEffect, useState } from "react";
import { ElectricityPriceData } from "@/functions/types";

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

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (data?.error) return <p className="text-red-500">{data.error}</p>;

  return (
    <main className="space-y-6 overflow-y-auto h-[calc(100vh-5em)]">
      <header className="p-4 bg-gray-100 rounded-xl">
        <p className="text-sm text-gray-700">
          {data?.metadata.description}{" "}
          <a
            className="underline font-bold"
            href="https://www.globalpetrolprices.com/data_electricity_download.php"
            target="_blank"
          >
            Here
          </a>
        </p>
      </header>

      <section>
        <h2 className="text-xl font-bold">Electricity Prices</h2>
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
        <h2 className="text-xl font-bold">Production Sources</h2>
        <p>
          Based on the United States Energy Information Adminstration data,
          electricity in the Philippines is produced from the following sources:
        </p>
        <table className="w-full border border-gray-300 rounded-lg">
          <tbody>
            {data?.production.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="p-2 font-medium">{item.what}</td>
                <td className="p-2">{item.value}&#37;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
