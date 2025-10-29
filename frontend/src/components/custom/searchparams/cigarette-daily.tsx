"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DashboardError } from "../dashboard/error-occured";
import { MainJson } from "@/functions/types";
type FuelDataOrError = MainJson & { error?: string };

type CigaretteListType = {
  initialData: MainJson;
};

const CigarettePriceList = ({ initialData }: CigaretteListType) => {
  const [data, setData] /*will set this later for refresh fetching*/ =
    useState<FuelDataOrError | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCommodity, setSelectedCommodity] = useState<string>("All");
  const [selectDate, setSelectDate] = useState<string>(initialData.date);
  const initialDefaultValue = data?.commodities.map((_, i) => String(i)) || [];

  if (data?.error) return <DashboardError message={data?.error} />
  if (!data || data.commodities.length === 0)
    return <p className="p-4 text-gray-500">No data available.</p>;

  // Dropdown options
  const commodityOptions = ["All", ...data.commodities.map((c) => c.commodity)];

  // filtered commodities
  const filteredCommodities =
    selectedCommodity === "All"
      ? data.commodities
      : data.commodities.filter((c) => c.commodity === selectedCommodity);

  async function handleSearchDate() {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/market?category=cigarette&date=${selectDate}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      setData(json);
    } catch (err) {
      console.error(err);
      setData({
        success: false,
        error: "Failed to fetch cigarette data. Please try again later.",
      } as MainJson);
    } finally {
      setLoading(false);
    }
  }
  if (!data.success) return <DashboardError message={data.error} />;
  return (
    <>
      <header className="p-4 bg-white border space-y-2 border-gray-200 rounded-xl shadow-sm">
        <p className="text-sm text-gray-700">
          Latest DA Price Monitoring Report:
          <span className="font-semibold text-gray-900"> {data?.date}</span>
        </p>
        <p className="text-sm text-gray-700">
          <strong>Note&#58; </strong>The data that are being shown are the only
          data that were available in the market/establishment.
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
          <article className="mt-4 flex flex-col sm:flex-col gap-3">
            <section className="flex items-center gap-2">
              <label htmlFor="dateFilter" className="text-gray-700 text-sm">
                Search Date:
              </label>
              <select
                id="dateFilter"
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                value={selectDate}
                onChange={(e) => setSelectDate(e.target.value)}
              >
                {initialData.dateData.map((d, idx) => (
                  <option key={idx} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSearchDate}
                disabled={loading}
                className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Loading..." : "Search"}
              </button>
            </section>

            <section className="flex items-center gap-2">
              <label
                htmlFor="commodityFilter"
                className="text-gray-700 text-sm"
              >
                Show Commodity:
              </label>
              <select
                id="commodityFilter"
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
              >
                {commodityOptions.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </section>
          </article>
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
    </>
  );
};

export default CigarettePriceList;
