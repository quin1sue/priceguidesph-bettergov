type ContentSkeletonProps = { variant?: "dashboard" | "table" | "chart" };

export function ContentSkeleton({ variant = "table" }: ContentSkeletonProps) {
  const rows = variant === "dashboard" ? 6 : 5;
  return (
    <section aria-label="Loading content" aria-busy="true" className="animate-pulse space-y-6 p-4 sm:p-6">
      <section className="space-y-3 border-b border-slate-200 pb-6">
        <p className="h-4 w-24 rounded bg-slate-200" />
        <p className="h-8 w-72 max-w-full rounded bg-slate-200" />
        <p className="h-4 w-full max-w-xl rounded bg-slate-100" />
      </section>
      {variant === "chart" ? (
        <section className="h-96 rounded-xl border border-slate-200 bg-slate-100" />
      ) : (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {Array.from({ length: rows }, (_, index) => (
            <section key={index} className="flex gap-4 border-b border-slate-100 p-4 last:border-0">
              <p className="h-4 w-2/3 rounded bg-slate-100" />
              <p className="h-4 w-1/4 rounded bg-slate-100" />
            </section>
          ))}
        </section>
      )}
    </section>
  );
}
