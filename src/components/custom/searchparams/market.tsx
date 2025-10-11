"use client";

import { useEffect, useState } from "react";

type DaPdfItem = {
  specification: string;
  price: number | null;
};

type DaPdfCommodity = {
  commodity: string;
  items: DaPdfItem[];
};

type DaPdfData = {
  date: string;
  parsedPDF: DaPdfCommodity[];
  error?: string;
};

export function DaPdfDataTable() {
  const [data, setData] = useState<DaPdfData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDaPdfData() {
      const res = await fetch("/api/latestmarketindex");
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    fetchDaPdfData();
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (data?.error) return <p className="text-red-500">{data.error}</p>;

  return (
    <main className="space-y-6 overflow-y-auto h-[calc(100vh-5em)] w-full">
      <header className="p-4 bg-gray-100 rounded-xl">
        <p className="text-sm text-gray-700">
          Latest DA Price Monitoring Report:{" "}
          <span className="font-bold">{data?.date}</span>
        </p>
      </header>

      {data?.parsedPDF.map((commodityGroup, idx) => (
        <section key={idx}>
          <h2 className="text-xl font-bold mb-2">{commodityGroup.commodity}</h2>

          <table className="w-full border border-gray-300 rounded-lg">
            <tbody>
              {commodityGroup.items.map((item, itemIdx) => (
                <tr key={itemIdx} className="border-b border-gray-200">
                  <td className="p-2 font-medium">{item.specification}</td>
                  <td className="p-2">
                    {item.price !== null ? item.price : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </main>
  );
}
