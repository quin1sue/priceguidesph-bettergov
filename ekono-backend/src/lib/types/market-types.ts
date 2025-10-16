export type MarketItem = {
  specification: string;
  price: number;
};

export type MarketCommodity = {
  commodity: string;
  items: MarketItem[];
};
