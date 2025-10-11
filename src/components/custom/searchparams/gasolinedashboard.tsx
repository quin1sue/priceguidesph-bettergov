"use client";

import { GasolinePrice } from "@/functions/types";
import { useEffect, useState } from "react";

type GasolinePriceOrError = GasolinePrice & { error?: string };

export function GasolineDataTable() {
  const [data, setData] = useState<GasolinePriceOrError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGasolineData() {
      const res = await fetch("/api/gasoline-price");
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    fetchGasolineData();
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (data?.error) return <p className="text-red-500">{data.error}</p>;

  return (
    <main className="space-y-6 overflow-y-auto h-[calc(100vh-5em)]">
      <header className="p-4 bg-gray-100 rounded-xl">
        <p className="text-sm text-gray-700">{data?.metadata.description}</p>
      </header>

      <section>
        <h2 className="text-xl font-bold">Gasoline Prices &#40;PHP&#41;</h2>
        <table className="w-full border border-gray-300 rounded-lg">
          <tbody>
            {data?.gasolinePricesPHP.map((item: any, idx: number) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="p-2 font-medium">{item.what}</td>
                <td className="p-2">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-bold">Analytics</h2>
        <table className="w-full border border-gray-300 rounded-lg">
          <tbody>
            {data?.analytics.map((item: any, idx: number) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="p-2 font-medium">{item.what}</td>
                <td className="p-2">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-bold">General Info</h2>
        <table className="w-full border border-gray-300 rounded-lg">
          <tbody>
            {data?.generalInfo.map((item: any, idx: number) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="p-2 font-medium">{item.what}</td>
                <td className="p-2">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
