import { Metadata } from "next";
import IndicatorClient from "./indicatorClient";
import { NotFound } from "@/components/custom/dashboard/category-notfound";
import { ResultSchema } from "@/functions/zod/economic-indicator";

type Params = {
  params: Promise<{
    category: string;
    indicator: string;
  }>;
};

async function getIndicatorData(indicator: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/economic-indicator?country=PHL&indicator=${indicator}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return { success: false };

  const json = await res.json();
  const parsed = ResultSchema.parse(json);
  const fetchedData = parsed.results[0] ?? [];
  return { data: fetchedData, success: fetchedData !== null };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { indicator, category } = await params;
  const { data } = await getIndicatorData(indicator);

  if (!data) {
    return {
      title: "Category Not Found",
      description: "This category does not exist in Price Guides PH.",
    };
  }
  return {
    title: `${data.indicatorName}`,
    description:
      data.note || `Explore ${data.indicatorName} data in ${data.country}.`,
    openGraph: {
      title: data.indicatorName,
      description: data.note as string,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_FE_DOMAIN}/${category}/${indicator}`,
    },
  };
}

export default async function IndicatorPage({ params }: Params) {
  const { indicator } = await params;
  const res = await getIndicatorData(indicator);

  const { data } = res;
  if (!res.success || data === undefined) return <NotFound />;
  return <IndicatorClient indicator={data} />;
}
