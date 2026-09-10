export type ConstructionItem = {
  id: string;
  product_category: string;
  commodity: string;
  brand_name: string | null;
  unit: string | null;
  size: string | null;
  current_price: number | null;
  previous_month_price: number | null;
  month_change_percent: number | null;
  month_change_php: number | null;
  three_months_ago_price: number | null;
  three_month_change_percent: number | null;
  three_month_change_php: number | null;
};

export type ConstructionCommodity = {
  commodity: string;
  items: ConstructionItem[];
};

export type ConstructionCategory = {
  category: string;
  commodities: ConstructionCommodity[];
};

export type ConstructionPagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type ConstructionPriceType = {
  success: boolean;
  error?: string;
  name: string;
  description: string;
  date: string;
  reportDate: string;
  previousPeriod: string | null;
  threeMonthsAgoPeriod: string | null;
  source: string;
  dateData: string[];
  pagination: ConstructionPagination;
  categories: ConstructionCategory[];
};
