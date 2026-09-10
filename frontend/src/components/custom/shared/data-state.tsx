"use client";

import { AlertCircle, Inbox, RefreshCw } from "lucide-react";

export function ErrorState({
  message = "We could not load this data. Please try again.",
}: {
  message?: string;
}) {
  return (
    <section
      className="flex min-h-72 max-w-xl flex-col items-start justify-center gap-4 rounded-xl border border-red-200 bg-red-50 p-6 text-slate-800"
      role="alert"
    >
      <AlertCircle aria-hidden="true" className="size-6 text-red-700" />
      <section className="space-y-1">
        <h2 className="font-semibold text-slate-950">Data unavailable</h2>
        <p className="text-sm leading-6 text-slate-700">{message}</p>
      </section>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        <RefreshCw aria-hidden="true" className="size-4" />
        Try again
      </button>
    </section>
  );
}

export function EmptyState({
  title = "No data available",
  description = "The selected source does not currently have data for this view.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="flex min-h-56 max-w-xl flex-col items-start justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-6">
      <Inbox aria-hidden="true" className="size-6 text-slate-500" />
      <h2 className="font-semibold text-slate-950">{title}</h2>
      <p className="text-sm leading-6 text-slate-600">{description}</p>
    </section>
  );
}

export function InlineLoading({ label = "Loading data" }: { label?: string }) {
  return (
    <p className="inline-flex items-center gap-2 text-sm text-slate-600" role="status">
      <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-700" />
      {label}
    </p>
  );
}
