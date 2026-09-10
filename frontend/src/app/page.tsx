import DashboardPage from "@/components/custom/dashboard/page";
import { ErrorState } from "@/components/custom/shared/data-state";
import { EconomicIndicatorsType } from "@/functions/types";
import { fetchIndicators } from "@/lib/api/economic-indicator";
export default async function Home() {
  const data: EconomicIndicatorsType = await fetchIndicators();
  if (!data.success) return <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><ErrorState message={data.error} /></main>;
  return (
    <>
      <DashboardPage initialData={data} />
    </>
  );
}
