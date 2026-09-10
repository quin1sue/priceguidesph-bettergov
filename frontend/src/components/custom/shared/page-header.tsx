import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
}: PageHeaderProps) {
  return (
    <header className="border-b border-slate-200 pb-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <section className="max-w-3xl space-y-2">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {title}
          </h1>
          <p className="text-sm leading-6 text-slate-600 sm:text-base">
            {description}
          </p>
        </section>
        {actions ? <aside className="shrink-0">{actions}</aside> : null}
      </section>
      {children ? <section className="mt-4">{children}</section> : null}
    </header>
  );
}

type DataDetailsProps = {
  date?: string;
  source: { name: string; href?: string };
  children?: ReactNode;
};

export function DataDetails({ date, source, children }: DataDetailsProps) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
      <dl className="flex flex-col gap-x-5 gap-y-1 sm:flex-row sm:flex-wrap">
        {date ? (
          <div className="flex gap-1">
            <dt className="font-semibold text-slate-900">Data date:</dt>
            <dd>{date}</dd>
          </div>
        ) : null}
        <div className="flex gap-1">
          <dt className="font-semibold text-slate-900">Source:</dt>
          <dd>
            {source.href ? (
              <a
                className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900"
                href={source.href}
                target="_blank"
                rel="noreferrer"
              >
                {source.name}
              </a>
            ) : (
              source.name
            )}
          </dd>
        </div>
      </dl>
      {children ? <section className="mt-2 text-slate-600">{children}</section> : null}
    </aside>
  );
}
