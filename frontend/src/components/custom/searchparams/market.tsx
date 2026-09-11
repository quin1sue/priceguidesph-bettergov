"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MainJson } from "@/functions/types";
import { DateFilter } from "../shared/date-filter";
import { DataDetails, PageHeader } from "../shared/page-header";
import { EmptyState, ErrorState } from "../shared/data-state";

type MarketType = { initialData: MainJson };

export default function MarketPriceTable({ initialData }: MarketType) {
  const [selectedCommodity, setSelectedCommodity] = useState("All");
  if (!initialData.success)
    return (
      <ErrorState
        message={initialData.error || "Market prices could not be loaded."}
      />
    );
  const commodities = initialData.commodities ?? [];
  const filteredCommodities =
    selectedCommodity === "All"
      ? commodities
      : commodities.filter(
          (commodity) => commodity.commodity === selectedCommodity,
        );

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Department of Agriculture"
        title="Philippine market prices"
        description="Prevailing retail prices from the latest available Department of Agriculture monitoring report. Filter by report date or commodity."
      />
      <DataDetails
        source={{
          name: "Department of Agriculture",
          href: "https://www.da.gov.ph/price-monitoring/",
        }}
        date={initialData.date}
      >
        Prevailing price is the arithmetic mean of prices observed in the
        report’s covered establishments.
      </DataDetails>
      {initialData.sourceDate ? (
        <p className="text-sm text-slate-600">
          Source report: {initialData.sourceDate}
        </p>
      ) : null}
      <DateFilter dates={initialData.dateData} currentDate={initialData.date} />
      <form
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        onSubmit={(event) => event.preventDefault()}
      >
        <label
          className="grid max-w-md gap-1.5 text-sm font-medium text-slate-800"
          htmlFor="market-commodity"
        >
          Commodity
          <select
            id="market-commodity"
            value={selectedCommodity}
            onChange={(event) => setSelectedCommodity(event.target.value)}
            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <option value="All">All commodities</option>
            {commodities.map((commodity, index) => (
              <option
                key={`${commodity.commodity}-${index}`}
                value={commodity.commodity}
              >
                {commodity.commodity}
              </option>
            ))}
          </select>
        </label>
      </form>
      {filteredCommodities.length ? (
        <section aria-live="polite">
          <Accordion
            type="multiple"
            defaultValue={filteredCommodities.map((_, index) => String(index))}
            className="space-y-3"
          >
            {filteredCommodities.map((commodity, index) => (
              <AccordionItem
                key={`${commodity.commodity}-${index}`}
                value={String(index)}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <AccordionTrigger className="px-4 py-3 text-left font-semibold text-slate-950 hover:text-blue-800">
                  {commodity.commodity}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <caption className="sr-only">
                        {commodity.commodity} prevailing prices in Philippine
                        pesos
                      </caption>
                      <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-700">
                        <tr>
                          <th scope="col" className="px-3 py-2 font-semibold">
                            Specification
                          </th>
                          <th scope="col" className="px-3 py-2 font-semibold">
                            Price (PHP)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {commodity.items.map((item, itemIndex) => (
                          <tr
                            key={`${item.specification}-${itemIndex}`}
                            className="border-b border-slate-100 last:border-0"
                          >
                            <td className="px-3 py-2 text-slate-800">
                              {item.specification}
                            </td>
                            <td className="px-3 py-2 font-medium text-slate-950">
                              {item.price ?? "Not available"}
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
        </section>
      ) : (
        <EmptyState
          title="No commodities match this filter"
          description="Try choosing all commodities."
        />
      )}
    </main>
  );
}
