import fs from "fs";
import path from "path";
import Papa from "papaparse";

// ── Shared helpers ────────────────────────────────────────────────────────────

const MONTHS = new Map([
  ["jan", 1], ["january", 1], ["feb", 2], ["february", 2],
  ["mar", 3], ["march", 3], ["apr", 4], ["april", 4],
  ["may", 5], ["jun", 6], ["june", 6], ["jul", 7], ["july", 7],
  ["aug", 8], ["august", 8], ["sep", 9], ["sept", 9], ["september", 9],
  ["oct", 10], ["october", 10], ["nov", 11], ["november", 11],
  ["dec", 12], ["december", 12],
]);

/**
 * Walk backwards from reportPeriod until we hit the month named by monthStr.
 * Handles year rollover automatically (e.g. report = Jan → prev = Dec of prior year).
 */
function periodFromMonthName(reportPeriod: string, monthStr: string): string | null {
  const target = MONTHS.get(monthStr.trim().toLowerCase());
  if (target === undefined) return null;
  const d = new Date(reportPeriod + "T00:00:00Z");
  for (let i = 0; i <= 12; i++) {
    if (d.getUTCMonth() + 1 === target) {
      return d.toISOString().split("T")[0];
    }
    d.setUTCMonth(d.getUTCMonth() - 1);
  }
  return null;
}

function parseNum(val: string | undefined): number | null {
  if (!val) return null;
  const clean = val.trim();
  if (clean === "" || clean === "NO SRP" || clean === "**" || clean === "-") return null;
  const n = parseFloat(clean.replace(/,/g, "").replace("%", ""));
  return isNaN(n) ? null : n;
}

function esc(str: string | null | undefined): string {
  if (str === null || str === undefined || str.trim() === "") return "NULL";
  return `'${str.trim().replace(/'/g, "''")}'`;
}

function uuid(): string {
  return crypto.randomUUID();
}

// ── Period detection from header rows ─────────────────────────────────────────
//
// Construction Materials CSV header (rows 1-8, 0-indexed):
//
//   row 0  MONTHLY COMPARATIVE PRICE DATA  …
//   row 1  NCR COVERAGE*  …
//   row 2  (empty)
//   row 3  CONSTRUCTION MATERIALS  …
//   row 4  PRODUCT CATEGORY, COMMODITY, BRAND NAME, UNIT, SIZE, "MONITORED…"
//   row 5  ,,,,,CURRENT MONTH, A MONTH AGO, CURRENT VS. A MONTH AGO,,,THREE…
//   row 6  (empty)
//   row 7  ,,,,,NOVEMBER, OCTOBER, % CHANGE, PHP DIFF., NOVEMBER, AUGUST, …
//   row 8+ data rows
//
// We detect the period from row 7 (month names) + try to infer the year from
// the filename (e.g. 2025_11_NCR.csv → November 2025).

function detectPeriodsFromHeaders(
  rows: string[][],
  csvFile: string,
): { report: string; prev: string | null; threeAgo: string | null } {
  // Try to extract YYYY_MM from filename  e.g. "2025_11_NCR.csv"
  const fileBase = path.basename(csvFile);
  const fileMatch = fileBase.match(/(\d{4})_(\d{1,2})/);

  let reportPeriod: string | null = null;

  if (fileMatch) {
    const [, y, m] = fileMatch;
    reportPeriod = `${y}-${m.padStart(2, "0")}-01`;
  }

  // Scan all header rows for an ISO date as a fallback
  if (!reportPeriod) {
    for (const row of rows.slice(0, 12)) {
      for (const cell of row) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(cell?.trim() ?? "")) {
          reportPeriod = cell.trim();
          break;
        }
      }
      if (reportPeriod) break;
    }
  }

  if (!reportPeriod) {
    throw new Error("Cannot determine report period from filename or CSV headers.");
  }

  // Find the month-name header row (contains NOVEMBER / OCTOBER etc.)
  let prevPeriod: string | null = null;
  let threeAgoPeriod: string | null = null;

  for (const row of rows.slice(0, 12)) {
    // row must have at least cols 5 (current) and 6 (prev) and 10 (3-month)
    const col5 = row[5]?.trim() ?? "";
    const col6 = row[6]?.trim() ?? "";
    const col10 = row[10]?.trim() ?? "";

    // If col5 is a month name matching our reportPeriod month → this is the period row
    const col5Month = MONTHS.get(col5.toLowerCase());
    const reportMonth = new Date(reportPeriod + "T00:00:00Z").getUTCMonth() + 1;

    if (col5Month === reportMonth) {
      // col6 = previous month name
      if (MONTHS.has(col6.toLowerCase())) {
        prevPeriod = periodFromMonthName(reportPeriod, col6);
      }
      // col10 = three-months-ago month name
      if (MONTHS.has(col10.toLowerCase())) {
        threeAgoPeriod = periodFromMonthName(reportPeriod, col10);
      }
      break;
    }
  }

  return { report: reportPeriod, prev: prevPeriod, threeAgo: threeAgoPeriod };
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const csvFile =
    args[0] ||
    path.join(process.cwd(), "src/data/construction_datasets/2025_11_NCR.csv");

  if (!fs.existsSync(csvFile)) {
    console.error("CSV file not found:", csvFile);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvFile, "utf-8");
  const parsed = Papa.parse<string[]>(csvContent, { header: false });
  const rows = parsed.data as string[][];

  const { report: reportPeriod, prev: previousPeriod, threeAgo: threeMonthsAgoPeriod } =
    detectPeriodsFromHeaders(rows, csvFile);

  console.log(`Detected Report Period  : ${reportPeriod}`);
  console.log(`Detected Previous Period: ${previousPeriod}`);
  console.log(`Detected 3-Month Period : ${threeMonthsAgoPeriod}`);

  const sourceName = "DTI NCR Construction Materials Dataset";
  const sourceFile = path.basename(csvFile);

  let rowsParsed = 0;
  let rowsSkipped = 0;
  const sqlStatements: string[] = [];

  // Skip header rows.  Data rows start after the last header row.
  // We identify data rows as rows where col[0] and col[1] are non-empty text
  // and col[0] is not a known header sentinel.
  const HEADER_SENTINELS = new Set([
    "product category",
    "monthly comparative price data",
    "ncr coverage",
    "ncr coverage*",
    "construction materials",
  ]);

  for (const row of rows) {
    const cat = row[0]?.trim() ?? "";
    const comm = row[1]?.trim() ?? "";

    if (!cat || !comm) continue;
    if (HEADER_SENTINELS.has(cat.toLowerCase())) continue;
    // Skip the column-label rows
    if (cat === "PRODUCT CATEGORY") continue;

    rowsParsed++;

    const brand = row[2]?.trim() || null;
    const unit  = row[3]?.trim() || null;
    const size  = row[4]?.trim() || null;

    // Construction Materials column layout (0-indexed):
    // 0 category, 1 commodity, 2 brand, 3 unit, 4 size
    // 5 current, 6 prev month, 7 month % chg, 8 month PHP diff
    // (col 9 repeats current price in some rows – skip it)
    // 10 three-months-ago, 11 three-month % chg, 12 three-month PHP diff
    const current          = parseNum(row[5]);
    const prevMonth        = parseNum(row[6]);
    const monthChangePct   = parseNum(row[7]);
    const monthChangePhp   = parseNum(row[8]);
    const threeMonthsAgo   = parseNum(row[10]);
    const threeMonthPct    = parseNum(row[11]);
    const threeMonthPhp    = parseNum(row[12]);

    const id = uuid();

    const sql = `INSERT INTO MonthlyConstructionPrice (
        id, report_period, previous_period, three_months_ago_period,
        product_category, commodity, brand_name, unit, size,
        current_price, previous_month_price, month_change_percent, month_change_php,
        three_months_ago_price, three_month_change_percent, three_month_change_php,
        source, source_file
      ) VALUES (
        '${id}', '${reportPeriod}', ${esc(previousPeriod)}, ${esc(threeMonthsAgoPeriod)},
        ${esc(cat)}, ${esc(comm)}, ${esc(brand)}, ${esc(unit)}, ${esc(size)},
        ${current ?? "NULL"}, ${prevMonth ?? "NULL"}, ${monthChangePct ?? "NULL"}, ${monthChangePhp ?? "NULL"},
        ${threeMonthsAgo ?? "NULL"}, ${threeMonthPct ?? "NULL"}, ${threeMonthPhp ?? "NULL"},
        ${esc(sourceName)}, ${esc(sourceFile)}
      ) ON CONFLICT (report_period, product_category, commodity, COALESCE(brand_name, ''), COALESCE(unit, ''), COALESCE(size, '')) DO UPDATE SET
        current_price              = excluded.current_price,
        previous_month_price       = excluded.previous_month_price,
        month_change_percent       = excluded.month_change_percent,
        month_change_php           = excluded.month_change_php,
        three_months_ago_price     = excluded.three_months_ago_price,
        three_month_change_percent = excluded.three_month_change_percent,
        three_month_change_php     = excluded.three_month_change_php;`;

    sqlStatements.push(sql);
  }

  rowsSkipped = rowsParsed - sqlStatements.length;

  if (sqlStatements.length === 0) {
    console.log("\nNo data rows found to import.");
    process.exit(0);
  }

  const datePart = reportPeriod.substring(0, 7).replace(/-/g, "_"); // "2025_11"
  const sqlFileName = `${datePart}_construction.sql`;
  const outDir = path.join(process.cwd(), "migrations");
  const outFile = path.join(outDir, sqlFileName);

  if (fs.existsSync(outFile)) {
    console.warn(`\n[WARNING] ${sqlFileName} already exists – it will be overwritten.`);
  }

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(outFile, sqlStatements.join("\n"));

  console.log("\nImport Summary:");
  console.log(`  CSV File         : ${sourceFile}`);
  console.log(`  Report Period    : ${reportPeriod}`);
  console.log(`  Previous Period  : ${previousPeriod}`);
  console.log(`  3-Month Period   : ${threeMonthsAgoPeriod}`);
  console.log(`  Rows Parsed      : ${rowsParsed}`);
  console.log(`  Rows Skipped     : ${rowsSkipped}`);
  console.log(`  Rows Generated   : ${sqlStatements.length}`);
  console.log(`\n  Generated SQL    : migrations/${sqlFileName}`);
  console.log(`  Apply locally    : npx wrangler d1 execute MY_DB --local --file=migrations/${sqlFileName}`);
}

main();
