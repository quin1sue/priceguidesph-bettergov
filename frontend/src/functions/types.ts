export type Item = {
  specification: string;
  price: number | string | null;
};

export type Commodity = {
  commodity: string;
  items: Item[];
};

export type MainJson = {
  id: string;
  date: string;
  category: string;
  commodities: Commodity[];
};

// export type ElectricityPriceData = {
//   description: string;
//   date: string;
//   prices: { specification: string; value: string }[];
//   production: { specification: string; value: string }[];
//   error?: string;
// };
