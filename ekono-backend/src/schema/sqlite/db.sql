
-- NOTE !!! REMOVE THE COMMENTS IF YOU ARE PLANNING TO QUERY THIS CODE IN THE CONSOLE.
DROP TABLE IF EXISTS PriceGroup;
DROP TABLE IF EXISTS PriceCommodity;
DROP TABLE IF EXISTS PriceItem;
DROP TABLE IF EXISTS FuelType;
DROP TABLE IF EXISTS FuelSection;
DROP TABLE IF EXISTS FuelItem;
PRAGMA foreign_keys = ON; -- enable foreign key in sqlite

-- TABLE CREATION & RELATIONSHIPs

-- MARKET TABLES 
CREATE TABLE IF NOT EXISTS PriceGroup (
    id TEXT PRIMARY KEY, -- UUID
    date VARCHAR(255) NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('market', 'cigarette')),
);

CREATE TABLE IF NOT EXISTS PriceCommodity (
    id TEXT PRIMARY KEY, -- UUID
    group_id TEXT NOT NULL,
    commodity VARCHAR(255) NOT NULL,
    FOREIGN KEY (group_id) REFERENCES PriceGroup(id),
    -- items PriceItem[]
);

CREATE TABLE IF NOT EXISTS PriceItem (
    id TEXT PRIMARY KEY, -- UUID
    commodity_id TEXT NOT NULL,
    specification VARCHAR(255) NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (commodity_id) REFERENCES PriceCommodity(id) ON DELETE CASCADE
);

-- FUEL TABLES

CREATE TABLE IF NOT EXISTS FuelType (
    id TEXT PRIMARY KEY, -- UUID
    name TEXT NOT NULL,
    description TEXT, -- metadata
    date TEXT NOT NULL
    -- section e.g generalinfo, analytics, phpprices[]...
);

CREATE TABLE IF NOT EXISTS FuelSection (
    id TEXT PRIMARY KEY, -- UUID
    fuel_id TEXT NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (fuel_id) REFERENCES FuelType(id) ON DELETE CASCADE
    -- item FuelItem[]
);

CREATE TABLE IF NOT EXISTS FuelItem (
    id TEXT PRIMARY KEY, -- UUID
    section_id TEXT NOT NULL,
    specification VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    FOREIGN KEY (section_id) REFERENCES FuelSection(id)
);

-- INDEX
CREATE INDEX IF NOT EXISTS idx_commodity_group_id ON PriceCommodity(group_id);
CREATE INDEX IF NOT EXISTS idx_priceitem_commodity_id ON PriceItem(commodity_id);
CREATE INDEX IF NOT EXISTS idx_fuelsection_fuel_id ON FuelSection(fuel_id);
CREATE INDEX IF NOT EXISTS idx_fuelitem_section_id ON FuelItem(section_id);