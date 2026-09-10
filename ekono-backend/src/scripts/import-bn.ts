import fs from "fs";
import path from "path";
import Papa from "papaparse";

const months = new Map([
  ["jan", 1], ["january", 1], ["feb", 2], ["february", 2],
  ["mar", 3], ["march", 3], ["apr", 4], ["april", 4],
  ["may", 5], ["jun", 6], ["june", 6], ["jul", 7], ["july", 7],
  ["aug", 8], ["august", 8], ["sep", 9], ["sept", 9], ["september", 9],
  ["oct", 10], ["october", 10], ["nov", 11], ["november", 11], ["dec", 12], ["december", 12],
]);

function getPeriodFromMonthString(reportPeriod: string, monthStr: string): string {
  const targetMonth = months.get(monthStr.toLowerCase());
  if (targetMonth === undefined) return "";
  
  let d = new Date(reportPeriod);
  for (let i = 0; i <= 12; i++) {
     if ((d.getUTCMonth() + 1) === targetMonth) {
        return d.toISOString().split('T')[0];
     }
     d.setUTCMonth(d.getUTCMonth() - 1);
  }
  return "";
}

function parseNum(val: string): number | null {
  if (!val) return null;
  const clean = val.trim();
  if (clean === "" || clean === "NO SRP" || clean === "**") return null;
  const parsed = parseFloat(clean.replace(/,/g, "").replace("%", ""));
  if (isNaN(parsed)) return null;
  return parsed;
}

function generateId() {
  return crypto.randomUUID();
}

function escapeSqlString(str: string | null): string {
  if (str === null || str === undefined) return "NULL";
  return `'${str.replace(/'/g, "''")}'`;
}

function main() {
  const args = process.argv.slice(2);
  const csvFile = args[0] || path.join(process.cwd(), "src/data/bn_datasets/2025_11_NCR.csv");

  if (!fs.existsSync(csvFile)) {
    console.error("CSV file not found:", csvFile);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvFile, "utf-8");
  const parsed = Papa.parse<string[]>(csvContent, { header: false });

  let reportPeriod: string | null = null;
  let previousPeriod: string | null = null;
  let threeMonthsAgoPeriod: string | null = null;
  
  let rowsParsed = 0;
  let rowsImported = 0;
  let rowsSkipped = 0;

  const sqlStatements: string[] = [];
  const sourceName = "DTI NCR BN Dataset";
  const sourceFile = path.basename(csvFile);

  for (let i = 0; i < parsed.data.length; i++) {
    const row = parsed.data[i];
    if (!row || row.length < 10) continue;

    const col5 = row[5]?.trim() || "";
    
    // Auto-detect dates if we haven't yet, look for ISO date in column 5
    if (!reportPeriod && /^\d{4}-\d{2}-\d{2}$/.test(col5)) {
      reportPeriod = col5;
      
      const col6 = row[6]?.trim() || "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(col6)) {
        previousPeriod = col6;
      } else if (months.has(col6.toLowerCase())) {
        previousPeriod = getPeriodFromMonthString(reportPeriod, col6);
      }

      // Check 10 and 11 for an ISO date
      if (/^\d{4}-\d{2}-\d{2}$/.test(row[10]?.trim())) {
         threeMonthsAgoPeriod = row[10].trim();
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(row[11]?.trim())) {
         threeMonthsAgoPeriod = row[11].trim();
      }
      
      continue;
    }

    // Process data rows
    const cat = row[0]?.trim() || "";
    const comm = row[1]?.trim() || "";
    if (cat && comm && cat !== "PRODUCT CATEGORY" && cat.toLowerCase() !== "monthly comparative price data" && !cat.toLowerCase().includes("basic necessities")) {
      rowsParsed++;
      
      if (!reportPeriod) {
        console.warn("Found data row but no report period detected yet!");
        rowsSkipped++;
        continue;
      }

      const brand = row[2]?.trim() || null;
      const spec = row[3]?.trim() || null;
      
      const srp = parseNum(row[4]);
      const current = parseNum(row[5]);
      const prev = parseNum(row[6]);
      const monthChangePct = parseNum(row[7]);
      const monthChangePhp = parseNum(row[8]);
      const threeMonthsAgo = parseNum(row[10]);
      const threeMonthChangePct = parseNum(row[11]);
      const threeMonthChangePhp = parseNum(row[12]);

      const id = generateId();

      const sql = `INSERT INTO MonthlyBnPrice (
        id, report_period, previous_period, three_months_ago_period,
        product_category, commodity, brand_name, specification,
        srp, current_price, previous_month_price, month_change_percent, month_change_php,
        three_months_ago_price, three_month_change_percent, three_month_change_php,
        source, source_file
      ) VALUES (
        '${id}', '${reportPeriod}', ${escapeSqlString(previousPeriod)}, ${escapeSqlString(threeMonthsAgoPeriod)},
        ${escapeSqlString(cat)}, ${escapeSqlString(comm)}, ${escapeSqlString(brand)}, ${escapeSqlString(spec)},
        ${srp ?? 'NULL'}, ${current ?? 'NULL'}, ${prev ?? 'NULL'}, ${monthChangePct ?? 'NULL'}, ${monthChangePhp ?? 'NULL'},
        ${threeMonthsAgo ?? 'NULL'}, ${threeMonthChangePct ?? 'NULL'}, ${threeMonthChangePhp ?? 'NULL'},
        ${escapeSqlString(sourceName)}, ${escapeSqlString(sourceFile)}
      ) ON CONFLICT (report_period, product_category, commodity, COALESCE(brand_name, ''), COALESCE(specification, '')) DO UPDATE SET
        srp = excluded.srp,
        current_price = excluded.current_price,
        previous_month_price = excluded.previous_month_price,
        month_change_percent = excluded.month_change_percent,
        month_change_php = excluded.month_change_php,
        three_months_ago_price = excluded.three_months_ago_price,
        three_month_change_percent = excluded.three_month_change_percent,
        three_month_change_php = excluded.three_month_change_php;`;

      sqlStatements.push(sql);
      rowsImported++;
    } else {
      if (cat !== "" || comm !== "") {
          rowsSkipped++;
      }
    }
  }

  if (sqlStatements.length > 0 && reportPeriod) {
    const reportDateStr = reportPeriod.replace(/-/g, "_").substring(0, 7); // e.g. "2025_11"
    const sqlFileName = `${reportDateStr}_bn.sql`;
    const outDir = path.join(process.cwd(), "migrations");
    const outFile = path.join(outDir, sqlFileName);
    
    // Safety check for overwriting unrelated migration
    if (fs.existsSync(outFile)) {
      console.warn(`\n[WARNING] Output file ${sqlFileName} already exists in migrations/! It will be overwritten.`);
    }

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(outFile, sqlStatements.join("\n"));
    
    console.log(`\nImport Summary:`);
    console.log(`CSV File: ${sourceFile}`);
    console.log(`Detected Report Period: ${reportPeriod}`);
    console.log(`Detected Previous Period: ${previousPeriod}`);
    console.log(`Detected 3-Month Period: ${threeMonthsAgoPeriod}`);
    console.log(`Rows Parsed: ${rowsParsed}`);
    console.log(`Rows Skipped: ${rowsSkipped}`);
    console.log(`Rows Generated (SQL Insert/Upsert): ${rowsImported}`);
    console.log(`\nGenerated SQL file at: migrations/${sqlFileName}`);
    console.log(`To apply to local D1, run: npx wrangler d1 execute MY_DB --local --file=migrations/${sqlFileName}`);
  } else {
    console.log("No data rows found to import or missing report period.");
  }
}

main();
