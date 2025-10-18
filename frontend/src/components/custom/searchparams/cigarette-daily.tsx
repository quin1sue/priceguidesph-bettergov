"use client";

import React, { useEffect, useState } from "react";
import { TableSkeleton } from "../global/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MainJson } from "@/functions/types";

export const CigarettePriceList: React.FC = () => {
  const [data, setData] = useState<MainJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCommodity, setSelectedCommodity] = useState<string>("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/market?category=cigarette`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const json: MainJson = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const initialDefaultValue =
    data?.commodities.map((_, i) => String(i)) || [];

  if (loading) return <TableSkeleton />;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  if (!data || data.commodities.length === 0)
    return <p className="p-4 text-gray-500">No data available.</p>;

  // Dropdown options
  const commodityOptions = ["All", ...data.commodities.map(c => c.commodity)];

  // Filtered commodities
  const filteredCommodities =
    selectedCommodity === "All"
      ? data.commodities
      : data.commodities.filter(c => c.commodity === selectedCommodity);

  return (
    <main className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-5em)] w-full">
      <header className="p-4 bg-white border border-gray-200 space-y-1 rounded-xl shadow-sm">
        <p className="text-sm text-gray-700">
          <strong>Note&#58; </strong> n&#47;a - not available in the market
        </p>
        <p className="text-sm">
          Prevailing Retail Prices of Cigarettes in Selected Retail
          Establishments in the National Capital Region &#40;NCR&#41;, by Brand
          Name/Variant &#40;PHP&#47;pack&#41;
        </p>
        <p className="mt-2 text-sm text-gray-700">
          Source&#58;
          <a
            className="underline font-semibold text-blue-700 ml-1"
            href="https://www.da.gov.ph/price-monitoring/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Department of Agriculture
          </a>
        </p>

        <header className="mt-3 rounded-md">
          <label htmlFor="commodityFilter" className="text-gray-700 mr-2">
            Show Commodity:
          </label>
          <select
            id="commodityFilter"
            className="border border-gray-300 rounded px-2 py-1"
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
          >
            {commodityOptions.map((c, idx) => (
              <option key={idx} value={c}>
                {c}
              </option>
            ))}
          </select>
        </header>
      </header>

      <Accordion
        type="multiple"
        defaultValue={initialDefaultValue}
        className="space-y-3"
      >
        {filteredCommodities.map((section, idx) => (
          <AccordionItem
            key={idx}
            value={`${idx}`}
            className="border border-gray-200 rounded-xl bg-white shadow-sm"
          >
            <AccordionTrigger className="px-4 py-3 text-left font-semibold text-gray-900 hover:text-blue-700 transition">
              {section.commodity}
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-3">
              {section.items.length > 0 ? (
                <ul className="divide-y text-sm">
                  {section.items.map((item, i) => (
                    <li
                      key={i}
                      className="py-2 flex justify-between hover:bg-gray-50 rounded-md px-1 transition"
                    >
                      <p className="max-sm:text-sm">{item.specification}</p>
                      <p className="font-medium">{`₱${item.price}`}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No items available.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};
