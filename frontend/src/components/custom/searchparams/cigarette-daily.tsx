"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MainJson } from "@/functions/types";
import { DateFilter } from "../shared/date-filter";
import { DataDetails, PageHeader } from "../shared/page-header";
import { EmptyState, ErrorState } from "../shared/data-state";

type CigarettePriceListProps = { initialData: MainJson };

export default function CigarettePriceList({ initialData }: CigarettePriceListProps) {
  const [selectedCommodity, setSelectedCommodity] = useState("All");
  if (!initialData.success) return <ErrorState message={initialData.error || "Cigarette price data could not be loaded."} />;
  const commodities = initialData.commodities ?? [];
  const visibleCommodities = selectedCommodity === "All" ? commodities : commodities.filter((item) => item.commodity === selectedCommodity);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader eyebrow="Department of Agriculture" title="Philippines cigarette prices" description="Available cigarette prices from the DA monitoring report for selected retail establishments in the National Capital Region." />
      <DataDetails source={{ name: "Department of Agriculture", href: "https://www.da.gov.ph/price-monitoring/" }} date={initialData.date}>
        Prices are reported per pack where available; this is not a nationwide price survey.
      </DataDetails>
      {initialData.sourceDate ? <p className="text-sm text-slate-600">Source report: {initialData.sourceDate}</p> : null}
      <DateFilter dates={initialData.dateData} currentDate={initialData.date} />
      <form className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" onSubmit={(event) => event.preventDefault()}>
        <label className="grid max-w-md gap-1.5 text-sm font-medium text-slate-800" htmlFor="cigarette-commodity">Brand group
          <select id="cigarette-commodity" value={selectedCommodity} onChange={(event) => setSelectedCommodity(event.target.value)} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"><option value="All">All brand groups</option>{commodities.map((commodity, index) => <option key={`${commodity.commodity}-${index}`} value={commodity.commodity}>{commodity.commodity}</option>)}</select>
        </label>
      </form>
      {visibleCommodities.length ? <Accordion type="multiple" defaultValue={visibleCommodities.map((_, index) => String(index))} className="space-y-3" aria-live="polite">
        {visibleCommodities.map((commodity, index) => <AccordionItem key={`${commodity.commodity}-${index}`} value={String(index)} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><AccordionTrigger className="px-4 py-3 text-left font-semibold text-slate-950 hover:text-blue-800">{commodity.commodity}</AccordionTrigger><AccordionContent className="px-4 pb-4"><div className="overflow-x-auto"><table className="min-w-full text-sm"><caption className="sr-only">{commodity.commodity} cigarette prices in Philippine pesos</caption><thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-700"><tr><th scope="col" className="px-3 py-2 font-semibold">Brand / variant</th><th scope="col" className="px-3 py-2 font-semibold">Price (PHP)</th></tr></thead><tbody>{commodity.items.map((item, itemIndex) => <tr key={`${item.specification}-${itemIndex}`} className="border-b border-slate-100 last:border-0"><td className="px-3 py-2 text-slate-800">{item.specification}</td><td className="px-3 py-2 font-medium text-slate-950">₱{item.price}</td></tr>)}</tbody></table></div></AccordionContent></AccordionItem>)}
      </Accordion> : <EmptyState title="No brand groups match this filter" description="Try choosing all brand groups." />}
    </main>
  );
}
