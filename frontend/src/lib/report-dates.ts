export type ReportDate = {
  value: string;
  year: string;
  month: string;
  label: string;
};

const formatter = new Intl.DateTimeFormat("en-PH", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function getReportDates(values?: string[] | null): ReportDate[] {
  // Ensure values is an array before processing
  if (!Array.isArray(values)) return [];

  const seen = new Set<string>();
  return values.flatMap((value) => {
    if (!value || typeof value !== "string") return [];
    if (seen.has(value) || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return [];

    seen.add(value);
    const [year, month] = value.split("-");
    const date = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return [];

    return [{ value, year, month, label: formatter.format(date) }];
  });
}

export function monthLabel(month: string) {
  if (!month || !/^\d{2}$/.test(month)) return "";

  const date = new Date(`2000-${month}-01T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-PH", {
    month: "long",
    timeZone: "UTC",
  }).format(date);
}
