import dynamic from "next/dynamic";
import { Metadata } from "next";
import {
  fetchKerosene,
  fetchDiesel,
  fetchGasoline,
  fetchLPG,
} from "@/lib/api/petrol-get";
import { fetchCigarette } from "@/lib/api/cigarette-get";
import { fetchMarket, fetchDrugPrice } from "@/lib/api/market-get";
import { FuelTypePrice } from "@/functions/diesel";
import { MainJson, CurrencyRatesType, DrugPriceType } from "@/functions/types";
import { NotFound } from "@/components/custom/dashboard/category-notfound";
import { fetchExchangeRates } from "@/lib/api/exchangerates";
import { ComponentType } from "react";
import { DashboardError } from "@/components/custom/dashboard/error-occured";
type CategoryData =
  | MainJson
  | FuelTypePrice
  | CurrencyRatesType
  | DrugPriceType;

// dynamic component type that accepts initialData prop
type CategoryComponent = ComponentType<{ initialData: CategoryData }>;

const DrugPriceList = dynamic(
  () => import("@/components/custom/searchparams/drugprice"),
);
const CigaretteDaily = dynamic(
  () => import("@/components/custom/searchparams/cigarette-daily"),
);
const Market = dynamic(() => import("@/components/custom/searchparams/market"));
const DieselDashboard = dynamic(
  () => import("@/components/custom/searchparams/dieseldashboard"),
);
const ExchangeRate = dynamic(
  () => import("@/components/custom/searchparams/exchangeRate"),
);

const componentMap: Record<string, CategoryComponent> = {
  "drug-price-index": DrugPriceList as CategoryComponent,
  "cigarette-index": CigaretteDaily as CategoryComponent,
  "daily-price-index": Market as CategoryComponent,
  kerosene: DieselDashboard as CategoryComponent,
  diesel: DieselDashboard as CategoryComponent,
  gasoline: DieselDashboard as CategoryComponent,
  lpg: DieselDashboard as CategoryComponent,
  "currency-exchange": ExchangeRate as CategoryComponent,
};

const fetcherMap: Record<string, (date?: string) => Promise<CategoryData>> = {
  "drug-price-index": fetchDrugPrice,
  "cigarette-index": fetchCigarette,
  kerosene: fetchKerosene,
  diesel: fetchDiesel,
  lpg: fetchLPG,
  gasoline: fetchGasoline,
  "daily-price-index": fetchMarket,
  "currency-exchange": fetchExchangeRates,
};

type PageParams = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ date?: string }>;
};

const categoryMetadata: Record<string, { title: string; description: string }> =
  {
    "daily-price-index": {
      title: "Philippine market prices",
      description:
        "Browse Department of Agriculture prevailing market prices in the Philippines by report date and commodity.",
    },
    "cigarette-index": {
      title: "Philippines cigarette prices",
      description:
        "Browse Department of Agriculture cigarette price-monitoring data for selected NCR retail establishments.",
    },
    "drug-price-index": {
      title: "Philippine medicine prices",
      description:
        "Search Department of Health Drug Price Reference Index values for medicines in the Philippines.",
    },
    gasoline: {
      title: "Philippines gasoline prices",
      description:
        "View the latest available gasoline price information for the Philippines.",
    },
    diesel: {
      title: "Philippines diesel prices",
      description:
        "View the latest available diesel price information for the Philippines.",
    },
    kerosene: {
      title: "Philippines kerosene prices",
      description:
        "View the latest available kerosene price information for the Philippines.",
    },
    lpg: {
      title: "Philippines LPG prices",
      description:
        "View the latest available LPG price information for the Philippines.",
    },
    "currency-exchange": {
      title: "PHP exchange rates",
      description:
        "Browse current exchange rates against the Philippine peso and convert currencies to PHP.",
    },
  };

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { category } = await params;
  const details = categoryMetadata[category];
  if (!details) {
    return {
      title: "Category Not Found",
      description: "This category does not exist in Price Guides PH.",
    };
  }

  return {
    title: details.title,
    description: details.description,
    alternates: { canonical: `/${category}` },
  };
}

export default async function Page({ params, searchParams }: PageParams) {
  const { category } = await params;
  const { date } = await searchParams;

  const loadComponent = componentMap[category];
  const fetcher = fetcherMap[category];

  if (!loadComponent || !fetcher) return <NotFound />;

  const initialData = await fetcher(date);
  if (!initialData.success)
    return <DashboardError message={initialData.error} />;

  // Preload + Render
  const Component = loadComponent;

  return <Component key={date ?? initialData.date} initialData={initialData} />;
}
