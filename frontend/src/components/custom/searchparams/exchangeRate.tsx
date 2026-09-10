"use client";

import { useState } from "react";
import { CurrencyRatesType } from "@/functions/types";
import { DataDetails, PageHeader } from "../shared/page-header";
import { EmptyState, ErrorState } from "../shared/data-state";

type CurrencyType = { initialData: CurrencyRatesType };

export default function FxRates({ initialData }: CurrencyType) {
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const rates = initialData.rates ?? {};
  const currencies = Object.keys(rates).sort();
  const filtered = currencies.filter((currency) => currency.toLowerCase().includes(search.toLowerCase()));
  if (!initialData.success) return <ErrorState message={initialData.error || "Exchange rates could not be loaded."} />;
  const rate = rates[fromCurrency];
  const converted = fromCurrency === "PHP" ? amount : rate ? amount / rate : null;

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader eyebrow="Currency data" title="PHP exchange rates" description="Browse available exchange rates against the Philippine peso and convert a selected currency to PHP." />
      <DataDetails source={{ name: "FXRatesAPI", href: "https://fxratesapi.com/" }} date={initialData.date}>
        Rates are shown with PHP as the base. The data date is provided by the source; no fetch timestamp is available.
      </DataDetails>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" aria-labelledby="converter-title"><h2 id="converter-title" className="text-lg font-semibold text-slate-950">Convert to PHP</h2><form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={(event) => event.preventDefault()}><label className="grid gap-1.5 text-sm font-medium text-slate-800" htmlFor="currency-amount">Amount<input id="currency-amount" type="number" min="0" step="any" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="h-10 rounded-md border border-slate-300 px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" /></label><label className="grid flex-1 gap-1.5 text-sm font-medium text-slate-800" htmlFor="currency-from">Currency<select id="currency-from" value={fromCurrency} onChange={(event) => setFromCurrency(event.target.value)} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">{currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}</select></label><output className="rounded-md bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-950">{converted === null ? "Conversion unavailable" : `${amount} ${fromCurrency} = ₱${converted.toFixed(2)}`}</output></form></section>
      <section className="space-y-3" aria-labelledby="rates-title"><header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><section><h2 id="rates-title" className="text-lg font-semibold text-slate-950">Available exchange rates</h2><p className="text-sm text-slate-600">One unit of each currency converted to PHP.</p></section><label className="grid gap-1 text-sm font-medium text-slate-800" htmlFor="currency-search">Search currency<input id="currency-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="e.g. USD" className="h-10 rounded-md border border-slate-300 px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" /></label></header>{filtered.length ? <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"><table className="min-w-full text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-700"><tr><th scope="col" className="px-4 py-3 font-semibold">Currency</th><th scope="col" className="px-4 py-3 text-right font-semibold">Value in PHP</th></tr></thead><tbody>{filtered.map((currency) => <tr key={currency} className="border-b border-slate-100 last:border-0"><th scope="row" className="px-4 py-3 text-left font-medium text-slate-800">{currency}</th><td className="px-4 py-3 text-right font-semibold text-slate-950">₱{(1 / rates[currency]).toFixed(2)}</td></tr>)}</tbody></table></div> : <EmptyState title="No currencies match your search" description="Try a three-letter currency code, such as USD or JPY." />}</section>
    </main>
  );
}
