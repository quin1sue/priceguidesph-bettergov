"use client";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MainJson } from "@/functions/types";
import { DashboardError } from "../dashboard/error-occured";

type MarketType = {
  initialData: MainJson
}
export default function DaPdfDataTable({initialData} : MarketType) {
  const [data] = useState<MainJson | null>(initialData);
  const [selectedCommodity, setSelectedCommodity] = useState<string>("All"); // select commodity/filtering 
  let numberedArray: string[] = [];



  if (!data?.success)
    return <DashboardError message={initialData.error} />

  numberedArray = Array.from(
    { length: data?.commodities.length ?? 0 },
    (_, i) => String(i)
  );

  // Get unique commodities for the dropdown
  const commodityOptions = ["All", ...data!.commodities.map(c => c.commodity)];

  // Filter commodities based on selection
  const filteredCommodities =
    selectedCommodity === "All"
      ? data!.commodities
      : data!.commodities.filter(c => c.commodity === selectedCommodity);

  return (
    <>
      <header className="bg-white shadow-sm border border-gray-200 p-4 rounded-xl">
        <p className="text-sm text-gray-700">
          Latest DA Price Monitoring Report:
          <span className="font-semibold text-gray-900"> {data?.date}</span>
        </p>
        <p className="mt-2 text-sm">
          Prevailing price is defined as the average price at which any basic
          necessity has been sold in a given area. This is computed as the
          average price using arithmetic mean formula. Moreover, The data that
          are being shown are the only data that were available in the
          market/establishment.
        </p>
        <p className="mt-2 text-sm text-gray-700">
          Source:{" "}
          <a
            className="font-semibold underline text-blue-700 ml-1"
            href="https://www.da.gov.ph/price-monitoring/"
            target="_blank"
          >
            Department of Agriculture
          </a>
        </p>

        {/* Dropdown filter */}
        <header className="mt-4 rounded-md">
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
        defaultValue={numberedArray}
        className="space-y-3"
      >
        {filteredCommodities.map((commodityGroup, idx) => (
          <AccordionItem
            key={idx}
            value={`${idx}`}
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
                      <th className="p-2 text-left font-medium">
                        Price &#40;&#8369;&#41;
                      </th>
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
    </>
  );
}
