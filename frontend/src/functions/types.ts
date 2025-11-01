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
  status: number;
  dateData: string[];
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
  status: boolean;
  description: string;
  privacy: string;
  timestamp: number;
  date: string;
  base: string;
  rates: Record<string, number>;
};

export type DrugPriceType = {
  name: string;
  date: string;
  status: boolean;
  error: string;
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

export type EconomicIndicatorsType = {
  name: string;
  success: boolean;
  error: string;
  description: string;
  result: {
    indicatorName: string;
    description: string
    slug: string;
    indicatorCode: string;
    note: string;
    category: string;
    organization: string;
    data: { year: number; value: number }[];
  }[];
};
