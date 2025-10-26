"use client";

import { FuelTypePrice } from "@/functions/diesel";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DashboardError } from "../dashboard/error-occured";

type FuelDataOrError = FuelTypePrice & { error?: string };

type FuelListType = {
  initialData: FuelTypePrice
}
export default function FuelDataTable({initialData} : FuelListType) {
  const [data] = useState<FuelDataOrError | null>(initialData);

  if (!data?.success) return <DashboardError message={data?.error} />
  if (!data) return null;
  return (
       <>
      <header className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <h2 className="text-2xl text-gray-700 my-3 font-bold">{data.date}</h2>
        <p className="text-sm text-gray-700">{data.description}</p>
        <p className="mt-2">
          Source&#58;
          <a
            className="underline font-semibold text-blue-700 ml-1"
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
    </>
  );
}
