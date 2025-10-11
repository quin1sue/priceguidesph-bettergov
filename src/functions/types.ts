export type Item = {
  specification: string;
  price: number | string | null;
};

export type Commodity = {
  commodity: string;
  items: Item[];
};

export type MainJson = {
  date: string;
  parsedPDF: Commodity[];
};

export type GasolinePrice = {
  metadata: {
    description: string;
  };
  analytics: { what: string; value: string | number }[];
  generalInfo: { what: string; value: string | number }[];
  gasolinePricesPHP: { what: string; value: string | number }[];
};

export type ElectricityPriceData = {
  metadata: { description: string };
  prices: { what: string; value: string }[];
  production: { what: string; value: string }[];
  error?: string;
};
