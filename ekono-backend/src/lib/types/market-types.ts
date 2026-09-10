export type MarketItem = {
  specification: string;
  price: number;
};

export type MarketCommodity = {
  commodity: string;
  items: MarketItem[];
};

export type PriceGroup = {
  id: string;
  category: string;
  date: string;
  report_date: string | null;
};
