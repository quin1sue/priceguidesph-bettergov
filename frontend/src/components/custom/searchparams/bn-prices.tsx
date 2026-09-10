"use client";

import { useState, useId } from "react";
import { BnPriceType, BnItem } from "@/functions/bn-types";
import { DateFilter } from "../shared/date-filter";
import { DataDetails, PageHeader } from "../shared/page-header";
import { EmptyState, ErrorState } from "../shared/data-state";
import { FilterFields, useColumnVisibility, ColumnDef } from "./filter-fields";

const BN_COLUMNS: ColumnDef[] = [
  { key: "category", label: "Category", group: "Product" },
  { key: "commodity", label: "Commodity", group: "Product" },
  { key: "brand", label: "Brand", group: "Product" },
  { key: "spec", label: "Specification", group: "Product" },
  { key: "srp", label: "SRP", group: "Product" },
  { key: "current", label: "Current Price", group: "Current Month" },
  { key: "prev", label: "Previous Month", group: "vs. Month Ago" },
  { key: "mPct", label: "% Change", group: "vs. Month Ago" },
  { key: "mPhp", label: "PHP Diff.", group: "vs. Month Ago", defaultVisible: false },
  { key: "3ago", label: "3 Months Ago", group: "vs. 3 Months Ago" },
  { key: "3pct", label: "% Change", group: "vs. 3 Months Ago" },
  { key: "3php", label: "PHP Diff.", group: "vs. 3 Months Ago", defaultVisible: false },
];

function pctClass(v: number | null) {
  if (v === null) return "text-slate-600";
  return v > 0 ? "text-red-600" : v < 0 ? "text-green-600" : "text-slate-600";
}

function fmt(v: number | null) {
  return v !== null ? v : "-";
}

function fmtPct(v: number | null) {
  return v !== null ? `${v}%` : "-";
}

type BnPricesProps = { initialData: BnPriceType };

export default function BnPricesTable({ initialData }: BnPricesProps) {
  const searchId = useId();
  const categoryId = useId();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { visibleKeys, setVisibleKeys } = useColumnVisibility(BN_COLUMNS);

  if (!initialData.success) {
    return <ErrorState message={initialData.error || "Basic Necessities prices could not be loaded."} />;
  }

  const categories = initialData.categories ?? [];

  // Client-side search + category filtering
  const filteredCategories = categories
    .filter((cat) => selectedCategory === "All" || cat.category === selectedCategory)
    .map((cat) => ({
      ...cat,
      commodities: cat.commodities
        .map((comm) => ({
          ...comm,
          items: comm.items.filter((item: BnItem) => {
            if (!search) return true;
            const q = search.toLowerCase();
            return (
              cat.category.toLowerCase().includes(q) ||
              comm.commodity.toLowerCase().includes(q) ||
              (item.brand_name?.toLowerCase().includes(q) ?? false) ||
              (item.specification?.toLowerCase().includes(q) ?? false)
            );
          }),
        }))
        .filter((comm) => comm.items.length > 0),
    }))
    .filter((cat) => cat.commodities.length > 0);

  const show = (key: string) => visibleKeys.has(key);
  const totalVisible = filteredCategories.reduce(
    (n, cat) => n + cat.commodities.reduce((m, comm) => m + comm.items.length, 0),
    0
  );

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Department of Trade and Industry"
        title="Philippines Basic Necessities Price Guide"
        description="Browse Department of Trade and Industry monitored prevailing prices for Basic Necessities (BN) in the National Capital Region. Filter by report date or product category."
      />
      <DataDetails
        source={{ name: initialData.source || "DTI NCR", href: "#" }}
        date={initialData.date}
      >
        Prevailing prices for Basic Necessities (BN) are monitored in the NCR.
      </DataDetails>
      <section aria-label="Data filters" className="space-y-4">
        {/* Top Row: Date Filter */}
        <div>
          <DateFilter dates={initialData.dateData} currentDate={initialData.date} />
        </div>

        {/* Bottom Row: Search, Category, Reset, and Column Toggle below Date Filter */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <form className="flex flex-col gap-4 sm:flex-row sm:items-end sm:flex-wrap" onSubmit={(e) => e.preventDefault()}>
            {/* Search */}
            <label className="grid gap-1.5 text-sm font-medium text-slate-800" htmlFor={searchId}>
              Search
              <input
                id={searchId}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Product, brand, spec…"
                className="h-10 min-w-[200px] rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              />
            </label>

            {/* Product Category */}
            <label className="grid gap-1.5 text-sm font-medium text-slate-800" htmlFor={categoryId}>
              Product Category
              <select
                id={categoryId}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <option value="All">All categories</option>
                {categories.map((cat, i) => (
                  <option key={`${cat.category}-${i}`} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </label>

            {/* Reset data filters */}
            {(search || selectedCategory !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="h-10 self-end rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-600 hover:bg-slate-50"
              >
                Reset filters
              </button>
            )}
          </form>

          {/* Table display filter */}
          <div className="flex items-end">
            <FilterFields columns={BN_COLUMNS} visibleKeys={visibleKeys} onChange={setVisibleKeys} />
          </div>
        </div>
      </section>

      {(search || selectedCategory !== "All") && (
        <p className="text-sm text-slate-600">
          Showing <strong>{totalVisible}</strong> result{totalVisible !== 1 ? "s" : ""}
          {search && <> matching &ldquo;{search}&rdquo;</>}
          {selectedCategory !== "All" && <> in <strong>{selectedCategory}</strong></>}
        </p>
      )}

      {filteredCategories.length ? (
        <section aria-live="polite" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm whitespace-nowrap">
              <caption className="sr-only">Basic Necessities prevailing prices in Philippine pesos</caption>
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-700">
                <tr>
                  {show("category") && <th scope="col" className="px-4 py-3 font-semibold min-w-[160px]">Category</th>}
                  {show("commodity") && <th scope="col" className="px-4 py-3 font-semibold min-w-[200px]">Commodity</th>}
                  {show("brand") && <th scope="col" className="px-4 py-3 font-semibold min-w-[120px]">Brand</th>}
                  {show("spec") && <th scope="col" className="px-4 py-3 font-semibold min-w-[140px]">Specification</th>}
                  {show("srp") && <th scope="col" className="px-4 py-3 font-semibold text-right min-w-[80px]">SRP</th>}
                  {show("current") && <th scope="col" className="px-4 py-3 font-semibold text-right min-w-[100px]">Current Price</th>}
                  {show("prev") && <th scope="col" className="px-4 py-3 font-semibold text-right min-w-[110px]">Prev. Month</th>}
                  {show("mPct") && <th scope="col" className="px-4 py-3 font-semibold text-right min-w-[90px]">% Change</th>}
                  {show("mPhp") && <th scope="col" className="px-4 py-3 font-semibold text-right min-w-[90px]">PHP Diff.</th>}
                  {show("3ago") && <th scope="col" className="px-4 py-3 font-semibold text-right min-w-[110px]">3 Months Ago</th>}
                  {show("3pct") && <th scope="col" className="px-4 py-3 font-semibold text-right min-w-[90px]">% Change</th>}
                  {show("3php") && <th scope="col" className="px-4 py-3 font-semibold text-right min-w-[90px]">PHP Diff.</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) =>
                  cat.commodities.map((comm) =>
                    comm.items.map((item: BnItem, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                        {show("category") && <td className="px-4 py-2 text-slate-800">{cat.category}</td>}
                        {show("commodity") && <td className="px-4 py-2 font-medium text-slate-800">{comm.commodity}</td>}
                        {show("brand") && <td className="px-4 py-2 text-slate-600">{item.brand_name || "-"}</td>}
                        {show("spec") && <td className="px-4 py-2 text-slate-600">{item.specification || "-"}</td>}
                        {show("srp") && <td className="px-4 py-2 text-right text-slate-950">{fmt(item.srp)}</td>}
                        {show("current") && <td className="px-4 py-2 text-right font-medium text-slate-950">{fmt(item.current_price)}</td>}
                        {show("prev") && <td className="px-4 py-2 text-right text-slate-800">{fmt(item.previous_month_price)}</td>}
                        {show("mPct") && <td className={`px-4 py-2 text-right font-medium ${pctClass(item.month_change_percent)}`}>{fmtPct(item.month_change_percent)}</td>}
                        {show("mPhp") && <td className={`px-4 py-2 text-right ${pctClass(item.month_change_php ?? null)}`}>{fmt(item.month_change_php)}</td>}
                        {show("3ago") && <td className="px-4 py-2 text-right text-slate-800">{fmt(item.three_months_ago_price)}</td>}
                        {show("3pct") && <td className={`px-4 py-2 text-right font-medium ${pctClass(item.three_month_change_percent)}`}>{fmtPct(item.three_month_change_percent)}</td>}
                        {show("3php") && <td className={`px-4 py-2 text-right ${pctClass(item.three_month_change_php ?? null)}`}>{fmt(item.three_month_change_php)}</td>}
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <EmptyState
          title="No results found"
          description={search ? `No Basic Necessities match "${search}". Try a different search term.` : "Try choosing all categories."}
        />
      )}
    </main>
  );
}