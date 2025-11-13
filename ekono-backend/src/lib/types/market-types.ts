export type MarketItem = {
  specification: string;
  price: number;
};

export type MarketCommodity = {
  commodity: string;
  items: MarketItem[];
};

export type PriceGroup = {
  id: number;
  category: string;
  date: string;
}