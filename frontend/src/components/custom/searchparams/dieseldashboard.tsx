"use client";

import { FuelTypePrice } from "@/functions/diesel";
import { useEffect, useState } from "react";
import { TableSkeleton } from "../global/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FuelDataOrError = FuelTypePrice & { error?: string };

interface FuelDataTableProps {
  fuelCategory: "Kerosene" | "Diesel" | "Gasoline";
}

export function FuelDataTable({ fuelCategory }: FuelDataTableProps) {
  const [data, setData] = useState<FuelDataOrError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFuelData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/fuel-prices?category=${fuelCategory}`
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        setData({ error: "Failed to fetch fuel data" } as FuelDataOrError);
      } finally {
        setLoading(false);
      }
    }
    fetchFuelData();
  }, [fuelCategory]);

  if (loading) return <TableSkeleton />;
  if (data?.error) return <p className="text-red-500">{data.error}</p>;
  if (!data) return null;
  console.log(data);
  return (
    <main className="space-y-6 overflow-y-auto h-[calc(100vh-7.5em)] p-4">
      <header className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <p className="text-sm text-gray-700">{data.description}</p>
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
        defaultValue={data.sections.map((s) => s.name) || []}
        className="space-y-3"
      >
        {data.sections.map((section) => (
          <AccordionItem
            key={section.id}
            value={section.name}
            className="border rounded-lg bg-white shadow-sm"
          >
            <AccordionTrigger className="px-4 py-3 font-semibold text-gray-900 hover:text-blue-700">
              {section.name}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <table className="w-full border border-gray-300 rounded-lg">
                <tbody>
                  {section.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-2 font-medium">{item.specification}</td>
                      <td className="p-2">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
