CREATE TABLE IF NOT EXISTS MonthlyConstructionPrice (
    id TEXT PRIMARY KEY,
    report_period TEXT NOT NULL,
    previous_period TEXT,
    three_months_ago_period TEXT,
    product_category TEXT NOT NULL,
    commodity TEXT NOT NULL,
    brand_name TEXT,
    unit TEXT,
    size TEXT,
    current_price REAL,
    previous_month_price REAL,
    month_change_percent REAL,
    month_change_php REAL,
    three_months_ago_price REAL,
    three_month_change_percent REAL,
    three_month_change_php REAL,
    source TEXT,
    source_file TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_construction_price_period
    ON MonthlyConstructionPrice(report_period DESC);

CREATE INDEX IF NOT EXISTS idx_construction_price_period_cat
    ON MonthlyConstructionPrice(report_period DESC, product_category);

-- Uniqueness is on the natural key for a product in a given period.
-- COALESCE normalises NULLs so (A, NULL) and (A, NULL) conflict correctly.
CREATE UNIQUE INDEX IF NOT EXISTS idx_construction_price_unique
    ON MonthlyConstructionPrice(
        report_period,
        product_category,
        commodity,
        COALESCE(brand_name, ''),
        COALESCE(unit, ''),
        COALESCE(size, '')
    );
