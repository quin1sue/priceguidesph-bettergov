import { CigarettePriceList } from "@/components/custom/searchparams/cigarette-daily";
import { ElectricityDataTable } from "@/components/custom/searchparams/electricity-kwh";
import { FxRates } from "@/components/custom/searchparams/exchangeRate";
import { GasolineDataTable } from "@/components/custom/searchparams/gasolinedashboard";
import { DaPdfDataTable } from "@/components/custom/searchparams/market";

type SearchParams = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: SearchParams) {
  const url = (await searchParams)?.where;

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
        <FxRates />
      )}
    </>
  );
}
