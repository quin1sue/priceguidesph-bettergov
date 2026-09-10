"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DrugPriceType } from "@/functions/types";
import { DataDetails, PageHeader } from "../shared/page-header";
import { EmptyState, ErrorState } from "../shared/data-state";

type DrugPriceListProps = { initialData: DrugPriceType };

export default function DrugPriceList({ initialData }: DrugPriceListProps) {
  const [selectedDrug, setSelectedDrug] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  if (!initialData.success) return <ErrorState message={initialData.error || "Medicine price data could not be loaded."} />;

  const groups = Object.entries(initialData.data);
  const visibleGroups = groups.filter(([drugName]) => {
    const matchesSelect = selectedDrug === "All" || drugName === selectedDrug;
    return matchesSelect && drugName.toLowerCase().includes(searchQuery.trim().toLowerCase());
  });

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader eyebrow="Department of Health" title="Philippine medicine prices" description="Search reference lowest, median, and highest medicine prices from the Drug Price Reference Index." />
      <DataDetails source={{ name: "Drug Price Reference Index", href: "https://dpri.doh.gov.ph" }} date={initialData.date}>
        Prices are VAT inclusive except for medicines covered by the FDA VAT-exempt list. Facilities may vary by up to 5.1% above the DPRI.
      </DataDetails>
      <form className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
        <label className="grid gap-1.5 text-sm font-medium text-slate-800" htmlFor="medicine-search">Search medicine name
          <input id="medicine-search" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="e.g. paracetamol" className="h-10 rounded-md border border-slate-300 px-3 text-sm placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-800" htmlFor="medicine-group">Medicine group
          <select id="medicine-group" value={selectedDrug} onChange={(event) => setSelectedDrug(event.target.value)} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"><option value="All">All medicine groups</option>{groups.map(([drugName]) => <option key={drugName} value={drugName}>{drugName}</option>)}</select>
        </label>
      </form>
      {visibleGroups.length ? <Accordion type="multiple" defaultValue={visibleGroups.map((_, index) => String(index))} className="space-y-3">
        {visibleGroups.map(([drugName, entries], index) => <AccordionItem key={drugName} value={String(index)} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><AccordionTrigger className="px-4 py-3 text-left font-semibold text-slate-950 hover:text-blue-800">{drugName}</AccordionTrigger><AccordionContent className="px-4 pb-4"><div className="overflow-x-auto"><table className="min-w-[42rem] text-sm"><caption className="sr-only">Drug Price Reference Index values for {drugName}</caption><thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-700"><tr><th scope="col" className="px-3 py-2 font-semibold">Medicine</th><th scope="col" className="px-3 py-2 text-right font-semibold">Lowest (PHP)</th><th scope="col" className="px-3 py-2 text-right font-semibold">Median (PHP)</th><th scope="col" className="px-3 py-2 text-right font-semibold">Highest (PHP)</th></tr></thead><tbody>{entries.map((item) => <tr key={item.id} className="border-b border-slate-100 last:border-0"><td className="px-3 py-2 text-slate-800">{item.DrugName}</td><td className="px-3 py-2 text-right text-slate-700">₱{item.Lowest}</td><td className="px-3 py-2 text-right font-medium text-slate-950">₱{item.Median}</td><td className="px-3 py-2 text-right text-slate-700">₱{item.Highest}</td></tr>)}</tbody></table></div></AccordionContent></AccordionItem>)}
      </Accordion> : <EmptyState title="No medicine prices match your search" description="Try a shorter medicine name or select all medicine groups." />}
    </main>
  );
}
