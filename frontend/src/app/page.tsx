import DashboardPage from "@/components/custom/dashboard/page";
import { EconomicIndicatorsType } from "@/functions/types";
import { fetchIndicators } from "@/lib/api/economic-indicator";
export default async function Home() {
  const data: EconomicIndicatorsType = await fetchIndicators();
  return (
    <>
      <DashboardPage initialData={data} />
    </>
  );
}
