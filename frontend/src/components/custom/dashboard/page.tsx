import { CategorySection } from "./categorysection";
import { EconomicIndicatorsType } from "@/functions/types";
import { PageHeader } from "../shared/page-header";

type Props = {
  initialData: EconomicIndicatorsType;
};

export default function DashboardPage({ initialData }: Props) {
  const data = initialData.result ?? [];
  const grouped = {
    Economic: data.filter((d) => d.category === "Economic"),
    Social: data.filter((d) => d.category === "Social"),
    Environment: data.filter((d) => d.category === "Environment"),
  };

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Philippines economic data"
        title="Philippine economic indicators"
        description="Explore national economic, social, and environmental indicators. Select an indicator to view its historical trend, definition, and source."
      />

      <CategorySection
        title="Economic Indicators"
        indicators={grouped.Economic}
      />
      <CategorySection title="Social Indicators" indicators={grouped.Social} />
      <CategorySection
        title="Environmental Indicators"
        indicators={grouped.Environment}
      />

      <aside className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-950">
        This is a curated overview. Use the search in the header to explore the
        full indicator collection.
      </aside>
    </main>
  );
}
