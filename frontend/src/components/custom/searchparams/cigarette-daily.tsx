"use client";

import React, { useEffect, useState } from "react";
import { TableSkeleton } from "../global/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cigaretteData = data?.filter((da) => da.items.length !== 0);

  if (loading) return <TableSkeleton />;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  if (!data || data.length === 0)
    return <p className="p-4 text-gray-500">No data available.</p>;

  return (
    <main className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-5em)] w-full">
      <header className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <p className="text-sm text-gray-700">
          <strong>Note&#58; </strong> n/a - not available in the market
        </p>
        <p className="mt-2 text-sm text-gray-700">
          Source&#58;
          <a
            className="underline font-semibold text-blue-700 ml-1"
            href="https://www.da.gov.ph/price-monitoring/"
            target="_blank"
          >
            Department of Agriculture
          </a>
        </p>
      </header>

      <Accordion type="single" collapsible className="space-y-3">
        {cigaretteData?.map((section, idx) => (
          <AccordionItem
            key={idx}
            value={`item-${idx}`}
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
                      <span>{item.brandName}</span>
                      <span className="font-medium">
                        {item.price === "n/a" ? "N/A" : `₱${item.price}`}
                      </span>
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
