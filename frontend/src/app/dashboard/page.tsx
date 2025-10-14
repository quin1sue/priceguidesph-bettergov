import { CigarettePriceList } from "@/components/custom/searchparams/cigarette-daily";
import { DieselDataTable } from "@/components/custom/searchparams/dieseldashboard";
import { FxRates } from "@/components/custom/searchparams/exchangeRate";
import { GasolineDataTable } from "@/components/custom/searchparams/gasolinedashboard";
import { KeroseneDataTable } from "@/components/custom/searchparams/kerosene";
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
      ) : url === "daily-price-index" ? (
        <DaPdfDataTable />
      ) : url === "cigarette" ? (
        <CigarettePriceList />
      ) : url === "diesel" ? (
        <DieselDataTable />
      ) : url === "kerosene" ? (
        <KeroseneDataTable />
      ) : (
        <FxRates /> // default
      )}
    </>
  );
}
