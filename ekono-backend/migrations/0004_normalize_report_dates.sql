-- Remote audit before this migration:
--   * 0004 was not recorded in d1_migrations and report_date was absent.
--   * FuelType.date uses a descriptive prefix followed by DD-Mon-YYYY.
--   * PriceGroup.date uses "Month D, YYYY"; one existing blank value is invalid.
-- This migration preserves legacy date text and populates only deterministic ISO values.

ALTER TABLE PriceGroup ADD COLUMN report_date TEXT;
ALTER TABLE FuelType ADD COLUMN report_date TEXT;

-- FuelType: parse the known final eleven-character suffix (DD-Mon-YYYY).
-- Rows without the exact separators, a known month, or a day from 01 through 31 remain NULL.
WITH fuel_source AS (
  SELECT
    id,
    trim(date) AS source_date,
    substr(trim(date), -11, 2) AS day_text,
    lower(substr(trim(date), -8, 3)) AS month_text,
    substr(trim(date), -4, 4) AS year_text
  FROM FuelType
),
fuel_dates AS (
  SELECT
    id,
    day_text,
    year_text,
    CASE month_text
      WHEN 'jan' THEN '01' WHEN 'feb' THEN '02' WHEN 'mar' THEN '03'
      WHEN 'apr' THEN '04' WHEN 'may' THEN '05' WHEN 'jun' THEN '06'
      WHEN 'jul' THEN '07' WHEN 'aug' THEN '08' WHEN 'sep' THEN '09'
      WHEN 'oct' THEN '10' WHEN 'nov' THEN '11' WHEN 'dec' THEN '12'
    END AS month_number,
    source_date
  FROM fuel_source
)
UPDATE FuelType
SET report_date = (
  SELECT year_text || '-' || month_number || '-' || day_text
  FROM fuel_dates
  WHERE fuel_dates.id = FuelType.id
)
WHERE id IN (
  SELECT id
  FROM fuel_dates
  WHERE length(source_date) >= 11
    AND substr(source_date, -9, 1) = '-'
    AND substr(source_date, -5, 1) = '-'
    AND month_number IS NOT NULL
    AND length(year_text) = 4
    AND CAST(year_text AS INTEGER) BETWEEN 1000 AND 9999
    AND length(day_text) = 2
    AND CAST(day_text AS INTEGER) BETWEEN 1 AND 31
    AND day_text = printf('%02d', CAST(day_text AS INTEGER))
);

-- PriceGroup: parse the verified legacy "Month D, YYYY" format.
-- The blank legacy record and any future unrecognized value remain NULL.
WITH group_source AS (
  SELECT
    id,
    trim(date) AS source_date,
    lower(substr(trim(date), 1, instr(trim(date), ' ') - 1)) AS month_text,
    trim(substr(trim(date), instr(trim(date), ' ') + 1, instr(trim(date), ',') - instr(trim(date), ' ') - 1)) AS day_text,
    trim(substr(trim(date), instr(trim(date), ',') + 1)) AS year_text
  FROM PriceGroup
),
group_dates AS (
  SELECT
    id,
    day_text,
    year_text,
    CASE month_text
      WHEN 'january' THEN '01' WHEN 'february' THEN '02' WHEN 'march' THEN '03'
      WHEN 'april' THEN '04' WHEN 'may' THEN '05' WHEN 'june' THEN '06'
      WHEN 'july' THEN '07' WHEN 'august' THEN '08' WHEN 'september' THEN '09'
      WHEN 'october' THEN '10' WHEN 'november' THEN '11' WHEN 'december' THEN '12'
    END AS month_number,
    source_date
  FROM group_source
)
UPDATE PriceGroup
SET report_date = (
  SELECT year_text || '-' || month_number || '-' || printf('%02d', CAST(day_text AS INTEGER))
  FROM group_dates
  WHERE group_dates.id = PriceGroup.id
)
WHERE id IN (
  SELECT id
  FROM group_dates
  WHERE instr(source_date, ' ') > 1
    AND instr(source_date, ',') > instr(source_date, ' ')
    AND month_number IS NOT NULL
    AND length(year_text) = 4
    AND CAST(year_text AS INTEGER) BETWEEN 1000 AND 9999
    AND length(day_text) BETWEEN 1 AND 2
    AND CAST(day_text AS INTEGER) BETWEEN 1 AND 31
    AND (day_text = CAST(CAST(day_text AS INTEGER) AS TEXT)
      OR day_text = printf('%02d', CAST(day_text AS INTEGER)))
);

CREATE INDEX IF NOT EXISTS idx_pricegroup_category_report_date
  ON PriceGroup(category, report_date DESC);
CREATE INDEX IF NOT EXISTS idx_fueltype_name_report_date
  ON FuelType(name, report_date DESC);
