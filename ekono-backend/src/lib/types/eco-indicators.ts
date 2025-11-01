export type IndicatorMetaType  = {
name: string;
note: string;
organiztion: string;
};

export type EconomicRecordType = {
  CountryName: string;
  CountryCode: string;
  IndicatorCode: string;
  IndicatorName: string;
  IndicatorDefinition: string;
  Year: number;
  Value: number | null;
};