import { Metadata } from "next";
import IndicatorClient from "./indicatorClient";

type Params = {
  params: Promise<{
    category: string;
    indicator: string;
  }>;
};

async function getIndicatorData(indicator: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/economic-indicator?country=PHL&indicator=${indicator}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) throw new Error("Failed to fetch indicator data");

  const json = await res.json();
  return json.results[0];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { indicator, category } = await params
  const data = await getIndicatorData(indicator);

  return {
    title: `${data.indicatorName}`,
    description:
      data.note ||
      `Explore ${data.indicatorName} data in ${data.country}.`,
    openGraph: {
      title: data.indicatorName,
      description: data.note,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_FE_DOMAIN}/${category}/${indicator}`,
    },
  };
}

export default async function IndicatorPage({ params }: Params) {
     const { indicator } = await params
  const data = await getIndicatorData(indicator);
  return <IndicatorClient indicator={data} />;
}
