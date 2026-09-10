"use client";

import { useRef, useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export type ColumnDef = {
  key: string;
  label: string;
  group?: string;
  defaultVisible?: boolean;
};

type FilterFieldsProps = {
  columns: ColumnDef[];
  visibleKeys: Set<string>;
  onChange: (keys: Set<string>) => void;
};

export function FilterFields({ columns, visibleKeys, onChange }: FilterFieldsProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  function toggle(key: string) {
    const next = new Set(visibleKeys);
    if (next.has(key)) {
      // keep at least one column visible
      if (next.size === 1) return;
      next.delete(key);
    } else {
      next.add(key);
    }
    onChange(next);
  }

  function resetAll() {
    onChange(new Set(columns.map((c) => c.key)));
  }

  // Group columns by their group label
  const groups = new Map<string, ColumnDef[]>();
  for (const col of columns) {
    const g = col.group ?? "";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(col);
  }

  const hiddenCount = columns.length - visibleKeys.size;

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-700"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden />
        Filter fields
        {hiddenCount > 0 && (
          <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-xs text-white leading-none">
            {hiddenCount} hidden
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Select visible table columns"
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
        >
          <header className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Visible columns</h3>
            <div className="flex items-center gap-2">
              {hiddenCount > 0 && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Show all
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <fieldset>
            <legend className="sr-only">Choose which columns are visible</legend>
            <div className="space-y-3">
              {Array.from(groups.entries()).map(([group, cols]) => (
                <div key={group}>
                  {group && (
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {group}
                    </p>
                  )}
                  <div className="space-y-1">
                    {cols.map((col) => (
                      <label
                        key={col.key}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={visibleKeys.has(col.key)}
                          onChange={() => toggle(col.key)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        {col.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </div>
  );
}

/** Convenience hook: initialises visibility state from column definitions. */
export function useColumnVisibility(columns: ColumnDef[]) {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(
    () => new Set(columns.filter((c) => c.defaultVisible !== false).map((c) => c.key)),
  );
  return { visibleKeys, setVisibleKeys };
}
