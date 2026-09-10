const months = new Map([
  ["jan", 0], ["january", 0], ["feb", 1], ["february", 1],
  ["mar", 2], ["march", 2], ["apr", 3], ["april", 3],
  ["may", 4], ["jun", 5], ["june", 5], ["jul", 6], ["july", 6],
  ["aug", 7], ["august", 7], ["sep", 8], ["sept", 8], ["september", 8],
  ["oct", 9], ["october", 9], ["nov", 10], ["november", 10], ["dec", 11], ["december", 11],
]);

function toIsoDate(year: number, month: number, day: number): string | null {
  const date = new Date(Date.UTC(year, month, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) return null;
  return date.toISOString().slice(0, 10);
}

export function normalizeReportDate(value: string): string | null {
  const normalized = value.trim();
  const iso = normalized.match(/\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b/);
  if (iso) return toIsoDate(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));

  const dayFirst = normalized.match(/\b(\d{1,2})\s*[-/]?\s*([a-z]{3,9})\s*[-/,]?\s*(\d{4})\b/i);
  if (dayFirst) {
    const month = months.get(dayFirst[2].toLowerCase());
    return month === undefined ? null : toIsoDate(Number(dayFirst[3]), month, Number(dayFirst[1]));
  }

  const monthFirst = normalized.match(/\b([a-z]{3,9})\.?\s+(\d{1,2}),?\s+(\d{4})\b/i);
  if (monthFirst) {
    const month = months.get(monthFirst[1].toLowerCase());
    return month === undefined ? null : toIsoDate(Number(monthFirst[3]), month, Number(monthFirst[2]));
  }

  return null;
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && normalizeReportDate(value) === value;
}
