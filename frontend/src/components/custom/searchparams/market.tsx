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
  initialData: MainJson;
};

export default function DaPdfDataTable({ initialData }: MarketType) {
  const [data, setData] = useState<MainJson | null>(initialData);
  const [selectedCommodity, setSelectedCommodity] = useState<string>("All");
  const [selectDate, setSelectDate] = useState<string>(initialData.date);
  const [loading, setLoading] = useState(false);

  if (!data?.success) return <DashboardError message={initialData.error} />;

  // get numbered array for accordion open default
  const numberedArray = Array.from(
    { length: data.commodities.length ?? 0 },
    (_, i) => String(i)
  );

  const commodityOptions = ["All", ...data.commodities.map((c) => c.commodity)];

  const filteredCommodities =
    selectedCommodity === "All"
      ? data.commodities
      : data.commodities.filter((c) => c.commodity === selectedCommodity);

  async function handleSearchDate() {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/market?category=market&date=${selectDate}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      setData(json);
    } catch (err) {
      console.error(err);
      setData({
        success: false,
        error: "Failed to fetch market data. Please try again later.",
      } as MainJson);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className={"shadow-sm border border-gray-200 p-4 rounded-xl"}>
        <p className="text-sm text-gray-700">
          Latest DA Price Monitoring Report:
          <span className="font-semibold text-gray-900"> {loading ? "Loading" : data?.date}</span>
        </p>
        <p className="mt-2 text-sm text-gray-700">
          Prevailing price is defined as the average price at which any basic
          necessity has been sold in a given area. This is computed as the
          average price using arithmetic mean formula.
        </p>
        <p className="mt-2 text-sm text-gray-700">
          Source:
          <a
            className="font-semibold underline text-blue-700 ml-1"
            href="https://www.da.gov.ph/price-monitoring/"
            target="_blank"
          >
            Department of Agriculture
          </a>
        </p>

        {/* Date and Commodity Filters */}
        <article className="mt-4 flex flex-col gap-3">
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
            <label htmlFor="commodityFilter" className="text-gray-700 text-sm">
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

      {/* Data Table */}
      <Accordion
        type="multiple"
        defaultValue={numberedArray}
        className="space-y-3 mt-4"
      >
        {filteredCommodities.map((commodityGroup, idx) => (
          <AccordionItem
            key={idx}
            value={`${idx}`}
            className="border border-gray-200 rounded-xl shadow-sm"
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
