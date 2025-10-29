import dynamic from "next/dynamic";
import { Metadata, ResolvedMetadata } from "next";
import { fetchKerosene, fetchDiesel, fetchGasoline, fetchLPG } from "@/lib/api/petrol-get";
import { fetchCigarette } from "@/lib/api/cigarette-get";
import { fetchMarket, fetchDrugPrice} from "@/lib/api/market-get";
import { FuelTypePrice } from "@/functions/diesel";
import { MainJson, CurrencyRatesType, DrugPriceType } from "@/functions/types";
import { NotFound } from "@/components/custom/dashboard/category-notfound";
import { fetchExchangeRates } from "@/lib/api/exchangerates";
import { ComponentType } from "react";
import { DashboardError } from "@/components/custom/dashboard/error-occured";
type CategoryData = MainJson | FuelTypePrice | CurrencyRatesType | DrugPriceType;

// dynamic component type that accepts initialData prop AAAAAAAAHHH
type CategoryComponent = ComponentType<{ initialData: CategoryData }>;

const DrugPriceList = dynamic(() => import("@/components/custom/searchparams/drugprice"))
const CigaretteDaily = dynamic(() => import("@/components/custom/searchparams/cigarette-daily"));
const Market = dynamic(() => import("@/components/custom/searchparams/market"));
const DieselDashboard = dynamic(() => import("@/components/custom/searchparams/dieseldashboard"));
const ExchangeRate = dynamic(() => import("@/components/custom/searchparams/exchangeRate"));

const componentMap: Record<string, CategoryComponent> = {
  "drug-price-index": DrugPriceList as CategoryComponent,
  "cigarette-index": CigaretteDaily as CategoryComponent,
  "daily-price-index": Market as CategoryComponent,
  "kerosene": DieselDashboard as CategoryComponent,
  "diesel": DieselDashboard as CategoryComponent,
  "gasoline": DieselDashboard as CategoryComponent,
  "lpg": DieselDashboard as CategoryComponent,
  "currency-exchange": ExchangeRate as CategoryComponent,
};

const fetcherMap: Record<string, () => Promise<CategoryData>> = {
  "drug-price-index": fetchDrugPrice,
  "cigarette-index": fetchCigarette,
  "kerosene": fetchKerosene,
  "diesel": fetchDiesel,
  "lpg": fetchLPG,
  "gasoline": fetchGasoline,
  "daily-price-index": fetchMarket,
  "currency-exchange": fetchExchangeRates
};

type PageParams = {
  params: Promise<{ category: string }>;
};
export async function generateStaticParams() {
  return Object.keys(componentMap).map((category) => ({ category }));
}

export const revalidate = 1800; // 30mins

export async function generateMetadata(
  { params }: PageParams,
  parent: Promise<ResolvedMetadata>
): Promise<Metadata> {
  const { category } = await params;
  const previousImages = (await parent).openGraph?.images || [];
  const fetchMetadata = fetcherMap[category];
  
  if (!fetchMetadata) {
    return {
      title: "Category Not Found",
      description: "This category does not exist in Price Guides PH.",
      openGraph: {
        images: [...previousImages]
      }
    };
  }
  
  const metadata: CategoryData = await fetchMetadata();

  return {
    title: metadata.name,
    description: metadata.description,
    openGraph: {
      images: [...previousImages]
    }
  };
}

export default async function Page({ params }: PageParams) {
  const { category } = await params;
  const Component = componentMap[category];
  const fetcher = fetcherMap[category];

  if (!Component || !fetcher) return <NotFound />;

  const initialData = await fetcher();
  
  // if not success, returns a dashboard component with an error message. It could be.. the server is being rate limited or other server error occurrence
  if (!initialData.success) return <DashboardError message={initialData.error} /> 
  return <Component initialData={initialData} />;
}