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
  error: string;
  status: number
  dateData: string[]
  success: boolean;
  name: string;
  description: string;
  date: string;
  category: string;
  commodities: Commodity[];
};

export type CurrencyRatesType = {
  success: boolean;
  terms: string;
  error: string;
  name: string;
  status: boolean
  description: string;
  privacy: string;
  timestamp: number;
  date: string;
  base: string;
  rates: Record<string, number>;
};

export type DrugPriceType = {
  name: string  
  date: string;
  status: boolean
  error: string
  success: boolean;
  description: string;
  title: string;
  data: Record<
    string,
    {
      id: number;
      DrugName: string;
      Lowest: number;
      Median: number;
      Highest: number;
    }[]
  >;
};
// export type ElectricityPriceData = {
//   description: string;
//   date: string;
//   prices: { specification: string; value: string }[];
//   production: { specification: string; value: string }[];
//   error?: string;
// };
