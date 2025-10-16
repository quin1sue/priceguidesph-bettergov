export type ScrapedFuelData = {
  description: string;
  date: string;
  analytics?: { specification: string; value: string }[];
  generalInfo?: { specification: string; value: string }[];
  [key: string]: any;
};
