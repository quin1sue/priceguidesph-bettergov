export type BnItem = {
  id: string;
  product_category: string;
  commodity: string;
  brand_name: string | null;
  specification: string | null;
  srp: number | null;
  current_price: number | null;
  previous_month_price: number | null;
  month_change_percent: number | null;
  month_change_php: number | null;
  three_months_ago_price: number | null;
  three_month_change_percent: number | null;
  three_month_change_php: number | null;
};

export type BnCommodity = {
  commodity: string;
  items: BnItem[];
};

export type BnCategory = {
  category: string;
  commodities: BnCommodity[];
};

export type BnPriceType = {
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
  categories: BnCategory[];
};
