export type FuelItemType = {
  id: string;
  specification: string;
  value: string;
};

export type PetrolSection = {
  id: string;
  name: string;
  items: FuelItemType[];
};

export type FuelTypePrice = {
  id: string; // FuelType ID
  name: string;
  description: string;
  date: string;
  sections: PetrolSection[];
};
