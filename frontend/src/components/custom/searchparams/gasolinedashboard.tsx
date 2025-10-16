"use client";

import { GasolinePrice } from "@/functions/types";
import { useEffect, useState } from "react";
import { TableSkeleton } from "../global/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type GasolinePriceOrError = GasolinePrice & { error?: string };

export function GasolineDataTable() {
  const [data, setData] = useState<GasolinePriceOrError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGasolineData() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/gasoline-prices`
      );
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    fetchGasolineData();
  }, []);

  if (loading) return <TableSkeleton />;
  if (data?.error) return <p className="text-red-500">{data.error}</p>;

  return (
    <main className="space-y-6 overflow-y-auto h-[calc(100vh-5em)] p-4">
      <header className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <p className="text-sm text-gray-700">{data?.description}</p>
        <p className="mt-2">
          Source&#58;{" "}
          <a
            className="underline font-semibold text-blue-700"
            href="https://www.globalpetrolprices.com/Philippines/gasoline_prices/"
            target="_blank"
          >
            globalpetrolprices.com
          </a>
        </p>
      </header>

      <Accordion
        type="multiple"
        defaultValue={["prices", "analytics", "general-info"]}
        className="space-y-3"
      >
        <AccordionItem
          value="prices"
          className="border rounded-lg bg-white shadow-sm"
        >
          <AccordionTrigger className="px-4 py-3 font-semibold text-gray-900 hover:text-blue-700">
            Gasoline Prices &#40;PHP&#41;
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <table className="w-full border border-gray-300 rounded-lg">
              <tbody>
                {data?.gasolinePricesPHP.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="p-2 font-medium">{item.specification}</td>
                    <td className="p-2">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="analytics"
          className="border rounded-lg bg-white shadow-sm"
        >
          <AccordionTrigger className="px-4 py-3 font-semibold text-gray-900 hover:text-blue-700">
            Analytics
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <table className="w-full border border-gray-300 rounded-lg">
              <tbody>
                {data?.analytics.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="p-2 font-medium">{item.specification}</td>
                    <td className="p-2">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="general-info"
          className="border rounded-lg bg-white shadow-sm"
        >
          <AccordionTrigger className="px-4 py-3 font-semibold text-gray-900 hover:text-blue-700">
            General Info
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <table className="w-full border border-gray-300 rounded-lg">
              <tbody>
                {data?.generalInfo.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="p-2 font-medium">{item.specification}</td>
                    <td className="p-2">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
