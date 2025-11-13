export type ScrapedFuelData = {
  description: string;
  date: string;
  analytics?: { specification: string; value: string }[];
  generalInfo?: { specification: string; value: string }[];
  [key: string]: any;
};

export interface FuelType {
      id: number;
      name: string;
      date: string; // e.g., "October 21, 2025"
      [key: string]: any;
    }

export interface FuelSection {
      id: number;
      name: string;
    }

export interface FuelItem {
      specification: string;
      value: string | number;
    }
