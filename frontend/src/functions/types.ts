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
  description: string;
  date: string;
  analytics: { specification: string; value: string | number }[];
  generalInfo: { specification: string; value: string | number }[];
  gasolinePricesPHP: { specification: string; value: string | number }[];
};
export type KerosenePrice = {
  description: string;
  date: string;
  generalInfo: { specification: string; value: string | number }[];
  kerosenePricesPHP: { specification: string; value: string | number }[];
};

export type DieselPrice = {
  description: string;
  date: string;
  analytics: { specification: string; value: string | number }[];
  generalInfo: { specification: string; value: string | number }[];
  dieselPricesPHP: { specification: string; value: string | number }[];
};
export type ElectricityPriceData = {
  description: string;
  date: string;
  prices: { specification: string; value: string }[];
  production: { specification: string; value: string }[];
  error?: string;
};
