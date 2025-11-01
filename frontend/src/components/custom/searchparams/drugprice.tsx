"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DashboardError } from "../dashboard/error-occured";
import { DrugPriceType } from "@/functions/types";

type DrugPriceListProps = {
  initialData: DrugPriceType;
};

const DrugPriceList = ({ initialData }: DrugPriceListProps) => {
  const [data] = useState<DrugPriceType | null>(initialData);
  const [selectedDrug, setSelectedDrug] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  if (!data) return <p className="p-4 text-gray-500">No data available.</p>;
  if (!data.success) return <DashboardError message="Failed to load drug data." />;

  const drugOptions = ["All", ...Object.keys(data.data)];

  let filteredDrugs = selectedDrug === "All"
    ? Object.entries(data.data)
    : Object.entries(data.data).filter(([drugName]) => drugName === selectedDrug);

  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase();
    filteredDrugs = filteredDrugs.filter(([drugName]) =>
      drugName.toLowerCase().includes(query)
    );
  }

  const defaultAccordionValues = filteredDrugs.map((_, idx) => `${idx}`);
  return (
    <>
      <header className="p-4border space-y-2 border-gray-200 rounded-xl shadow-sm">
        <p className="text-md font-bold text-gray-700">{initialData.date}</p>
        <p className="text-sm max-sm:text-[12px]">All Prices of Medicines reflected are VAT inclusive (except for medicines under VAT exempt list issued by FDA)
Health facilities may have a price variation up to 5.1% above the DPRI to account for inflation</p>
        <p className="text-sm text-gray-700">
          Source:{" "}
          <a
            className="underline font-semibold text-blue-700"
            href="https://dpri.doh.gov.ph"
            target="_blank"
            rel="noopener noreferrer"
          >
            Department of Health
          </a>
        </p>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <div>
            <label htmlFor="drugFilter" className="text-gray-700 mr-2">
              Show Drug:
            </label>
            <select
              id="drugFilter"
              className="border border-gray-300 rounded px-2 py-1"
              value={selectedDrug}
              onChange={(e) => setSelectedDrug(e.target.value)}
            >
              {drugOptions.map((drug, idx) => (
                <option key={idx} value={drug}>
                  {drug}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 sm:mt-0">
            <label htmlFor="searchDrug" className="text-gray-700 mr-2">
              Search:
            </label>
            <input
              id="searchDrug"
              type="text"
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="Type drug name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValues}
        className="space-y-3 mt-3"
      >
        {filteredDrugs.map(([drugName, entries], idx) => (
          <AccordionItem
            key={idx}
            value={`${idx}`}
            className="border border-gray-200 rounded-xl shadow-sm"
          >
            <AccordionTrigger className="px-4 py-3 text-left font-semibold text-gray-900 hover:text-blue-700 transition">
              {drugName}
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-3 overflow-x-auto">
              {entries.length > 0 ? (
                <table className="min-w-full text-sm border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border px-2 py-1 text-left">Drug Name</th>
                      <th className="border px-2 py-1 text-right">Lowest &#40;&#8369;&#41;</th>
                      <th className="border px-2 py-1 text-right">Median &#40;&#8369;&#41;</th>
                      <th className="border px-2 py-1 text-right">Highest &#40;&#8369;&#41;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">{item.DrugName}</td>
                        <td className="border px-2 py-1 text-right">{item.Lowest}</td>
                        <td className="border px-2 py-1 text-right">{item.Median}</td>
                        <td className="border px-2 py-1 text-right">{item.Highest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-sm">No items available.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default DrugPriceList;
