import { CigarettePriceList } from "@/components/custom/searchparams/cigarette-daily";
import { FxRates } from "@/components/custom/searchparams/exchangeRate";
import { FuelDataTable } from "@/components/custom/searchparams/dieseldashboard";
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
        <FuelDataTable fuelCategory="Gasoline" />
      ) : url === "daily-price-index" ? (
        <DaPdfDataTable />
      ) : url === "cigarette" ? (
        <CigarettePriceList />
      ) : url === "diesel" ? (
        <FuelDataTable fuelCategory="Diesel" />
      ) : url === "kerosene" ? (
        <FuelDataTable fuelCategory="Kerosene" />
      ) : (
        <FxRates /> // default
      )}
    </>
  );
}
