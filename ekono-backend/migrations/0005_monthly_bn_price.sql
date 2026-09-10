CREATE TABLE IF NOT EXISTS MonthlyBnPrice (
    id TEXT PRIMARY KEY,
    report_period TEXT NOT NULL,
    previous_period TEXT,
    three_months_ago_period TEXT,
    product_category TEXT NOT NULL,
    commodity TEXT NOT NULL,
    brand_name TEXT,
    specification TEXT,
    srp REAL,
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

CREATE INDEX IF NOT EXISTS idx_monthly_bn_price_period 
    ON MonthlyBnPrice(report_period DESC);

CREATE INDEX IF NOT EXISTS idx_monthly_bn_price_period_cat 
    ON MonthlyBnPrice(report_period DESC, product_category);

CREATE UNIQUE INDEX IF NOT EXISTS idx_monthly_bn_price_unique 
    ON MonthlyBnPrice(
        report_period, 
        product_category, 
        commodity, 
        COALESCE(brand_name, ''), 
        COALESCE(specification, '')
    );
