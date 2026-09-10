"use client";

import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getReportDates, monthLabel, type ReportDate } from "@/lib/report-dates";

type DateFilterProps = {
  dates: string[];
  currentDate: string;
  disabled?: boolean;
};

export function DateFilter({ dates, currentDate, disabled = false }: DateFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const reportDates = useMemo(() => getReportDates(dates), [dates]);
  const requestedDate = searchParams.get("date");
  const selectedDate = reportDates.find((date) => date.value === requestedDate)
    ?? reportDates.find((date) => date.value === currentDate)
    ?? reportDates[0];
  const selectedYear = selectedDate?.year ?? "";
  const availableYears = [...new Set(reportDates.map((date) => date.year))].sort((a, b) => b.localeCompare(a));
  const availableMonths = [...new Set(reportDates.filter((date) => date.year === selectedYear).map((date) => date.month))].sort();
  const selectedMonth = selectedDate?.month ?? "";
  const availableDates = reportDates.filter((date) => date.year === selectedYear && date.month === selectedMonth);

  function navigate(nextDate: ReportDate | undefined) {
    if (!nextDate || nextDate.value === requestedDate) return;
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("year", nextDate.year);
    nextParams.set("month", nextDate.month);
    nextParams.set("date", nextDate.value);
    startTransition(() => router.push(`${pathname}?${nextParams.toString()}`, { scroll: false }));
  }

  if (!reportDates.length) {
    return (
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950" role="status">
        Report-date filtering is unavailable because the source returned dates in an unsupported format.
      </section>
    );
  }

  const controlsDisabled = disabled || isPending;
  return (
    <form className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" aria-busy={isPending} onSubmit={(event) => event.preventDefault()}>
      <fieldset className="grid gap-4 md:grid-cols-3">
        <legend className="mb-3 text-sm font-semibold text-slate-950">Filter reports</legend>
        <label className="grid gap-1.5 text-sm font-medium text-slate-800" htmlFor="report-year">
          Year
          <select id="report-year" value={selectedYear} disabled={controlsDisabled} onChange={(event) => {
            const firstDate = reportDates.find((date) => date.year === event.target.value);
            navigate(firstDate);
          }} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:bg-slate-100">
            {availableYears.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-800" htmlFor="report-month">
          Month
          <select id="report-month" value={selectedMonth} disabled={controlsDisabled} onChange={(event) => {
            const firstDate = reportDates.find((date) => date.year === selectedYear && date.month === event.target.value);
            navigate(firstDate);
          }} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:bg-slate-100">
            {availableMonths.map((month) => <option key={month} value={month}>{monthLabel(month)}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-800" htmlFor="report-date">
          Report date
          <select id="report-date" value={selectedDate?.value ?? ""} disabled={controlsDisabled} onChange={(event) => navigate(reportDates.find((date) => date.value === event.target.value))} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:bg-slate-100">
            {availableDates.map((date) => <option key={date.value} value={date.value}>{date.label}</option>)}
          </select>
        </label>
      </fieldset>
      {isPending ? <p className="mt-3 text-sm text-slate-600" role="status">Loading the selected report. Current data remains visible.</p> : null}
    </form>
  );
}
