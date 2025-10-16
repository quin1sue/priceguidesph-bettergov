type Section = {
  id: string;
  name: string;
  items: { id: string; specification: string; value: string }[];
};
export type PetrolType = {
  id: string;
  name: string;
  date: string;
  description: string;
  sections: Section[];
};
