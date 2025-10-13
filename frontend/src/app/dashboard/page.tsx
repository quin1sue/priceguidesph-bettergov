import { CigarettePriceList } from "@/components/custom/searchparams/cigarette-daily";
import { ElectricityDataTable } from "@/components/custom/searchparams/electricity-kwh";
import { FxRates } from "@/components/custom/searchparams/exchangeRate";
import { GasolineDataTable } from "@/components/custom/searchparams/gasolinedashboard";
import { DaPdfDataTable } from "@/components/custom/searchparams/market";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const url = (params["where"] as string) || "";

  return (
    <>
      {url === "gasoline-prices" ? (
        <GasolineDataTable />
      ) : url === "electricity-kwh" ? (
        <ElectricityDataTable />
      ) : url === "daily-price-index" ? (
        <DaPdfDataTable />
      ) : url === "cigarette" ? (
        <CigarettePriceList />
      ) : (
        <FxRates /> // default
      )}
    </>
  );
}
