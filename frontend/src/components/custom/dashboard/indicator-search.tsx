"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Indicator = { slug: string; indicatorName: string; category: string };

export function IndicatorSearch({ mobile = false }: { mobile?: boolean }) {
  const [query, setQuery] = useState("");
  const [indicators, setIndicators] = useState<Indicator[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const loadIndicators = async () => {
    if (indicators || failed) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/economic-indicator/list`,
      );
      if (!response.ok) throw new Error("Request failed");
      const json = await response.json();
      setIndicators(json.result ?? []);
    } catch {
      setFailed(true);
    }
  };

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term || !indicators) return [];
    return indicators
      .filter((item) => item.indicatorName.toLowerCase().includes(term))
      .slice(0, 8);
  }, [indicators, query]);

  return (
    <search ref={container} className={mobile ? "relative border-t border-slate-200 p-3 md:hidden" : "relative hidden max-w-md flex-1 md:block"}>
      <label className="sr-only" htmlFor="indicator-search">
        Search Philippine economic indicators
      </label>
      <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
      <input
        id="indicator-search"
        value={query}
        onFocus={() => {
          setOpen(true);
          void loadIndicators();
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          void loadIndicators();
        }}
        placeholder="Search indicators, e.g. GDP"
        className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      />
      {open && query.trim() ? (
        <section className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
          {failed ? (
            <p className="p-3 text-sm text-slate-600">Search is temporarily unavailable.</p>
          ) : indicators === null ? (
            <p className="p-3 text-sm text-slate-600">Loading indicators…</p>
          ) : results.length ? (
            <ul aria-label="Indicator search results" className="max-h-80 overflow-y-auto py-1">
              {results.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/indicator/${item.slug}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-start justify-between gap-3 px-3 py-2 text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                  >
                    <span className="text-slate-800">{item.indicatorName}</span>
                    <span className="shrink-0 text-xs text-slate-500">{item.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-3 text-sm text-slate-600">No matching indicators found.</p>
          )}
        </section>
      ) : null}
    </search>
  );
}
