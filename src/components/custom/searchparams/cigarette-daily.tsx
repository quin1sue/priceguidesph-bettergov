"use client";
import React, { useEffect, useState } from "react";

type Item = {
  brandName: string;
  price: number | string;
};

type Commodity = {
  commodity: string;
  items: Item[];
};

export const CigarettePriceList: React.FC = () => {
  const [data, setData] = useState<Commodity[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dailycigarette");
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  if (!data || data.length === 0)
    return <p className="p-4 text-gray-500">No data available.</p>;

  return (
    <section className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-5em)] w-full">
      <header className="p-4 bg-gray-100 rounded-xl">
        <p className="text-md text-gray-700">
          {" "}
          <b>Note: </b>
          n&#47;a - not available in the market/establishment
        </p>
      </header>

      {data.map((section, idx) => (
        <article key={idx} className="border rounded-lg p-4 shadow-sm">
          <header>
            <h2 className="text-lg font-semibold mb-2">{section.commodity}</h2>
          </header>

          {section.items.length > 0 ? (
            <ul className="divide-y">
              {section.items.map((item, i) => (
                <li key={i} className="py-2 flex justify-between">
                  <span>{item.brandName}</span>
                  <span className="font-medium">
                    {item.price === "n/a" ? "N/A" : `₱${item.price}`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No items available.</p>
          )}
        </article>
      ))}
    </section>
  );
};
