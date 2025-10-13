"use client";

import { useEffect, useState } from "react";
import { TableSkeleton } from "../global/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  if (loading) return <TableSkeleton />;
  if (data?.error)
    return (
      <p className="text-red-500 text-center mt-10 text-sm">{data.error}</p>
    );

  return (
    <main className="space-y-6 overflow-y-auto h-[calc(100vh-5em)] w-full p-4">
      {/* Header */}
      <header className="bg-white shadow-sm border border-gray-200 p-4 rounded-xl">
        <p className="text-sm text-gray-700">
          Latest DA Price Monitoring Report:
          <span className="font-semibold text-gray-900"> {data?.date}</span>
        </p>
        <p className="mt-2 text-sm text-gray-700">
          Source&#58;
          <a
            className="font-semibold underline text-blue-700 ml-1"
            href="https://www.da.gov.ph/price-monitoring/"
            target="_blank"
          >
            Department of Agriculture
          </a>
        </p>
      </header>

      {/* Accordion */}
      <Accordion type="single" collapsible className="space-y-3">
        {data?.parsedPDF.map((commodityGroup, idx) => (
          <AccordionItem
            key={idx}
            value={`item-${idx}`}
            className="border border-gray-200 rounded-xl bg-white shadow-sm"
          >
            <AccordionTrigger className="px-4 py-3 text-left font-semibold text-gray-900 hover:text-blue-700 transition">
              {commodityGroup.commodity}
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4">
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-2 text-left font-medium">
                        Specification
                      </th>
                      <th className="p-2 text-left font-medium">Price (₱)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commodityGroup.items.map((item, itemIdx) => (
                      <tr
                        key={itemIdx}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="p-2">{item.specification}</td>
                        <td className="p-2">
                          {item.price !== null ? item.price : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
