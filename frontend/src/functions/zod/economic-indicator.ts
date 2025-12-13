import { success, z } from "zod";

/** Atomic schema for yearly data */
const YearlyDataSchema = z.object({
  year: z.number(),
  value: z.number(),
});

/** Indicator schema */
const IndicatorSchema = z.object({
  slug: z.string(),
  indicatorCode: z.string(),
  indicatorName: z.string(),
  description: z.string(),
  category: z.string(),
  organization: z.string(),
  data: z.array(YearlyDataSchema).optional(),
});

// name, success, description, result
/** Root schema matching /economic-indicator/list */
export const EconomicIndicatorsSchema = z.object({
  title: z.string(),
  error: z.string().nullable().optional(),
  success: z.boolean(),
  result: z.array(IndicatorSchema),
});

//  === independent data

export const ResultsSchema = z.object({
  slug: z.string(),
  country: z.string(),
  countryCode: z.string(),
  indicatorCode: z.string(),
  indicatorName: z.string(),
  note: z.string(),
  category: z.string(),
  organization: z.string(),
  data: z.array(YearlyDataSchema),
});

export const ResultSchema = z.object({
  error: z.string().nullable().optional(),
  count: z.number(),
  success: z.boolean(),
  results: z.array(ResultsSchema),
});

/** Type inferred from schema */
export type EconomicIndicatorsType = z.infer<typeof EconomicIndicatorsSchema>;
export type EconomicIndicatorType = z.infer<typeof ResultSchema>;
