"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FuelTypePrice } from "@/functions/diesel";
import { DataDetails, PageHeader } from "../shared/page-header";
import { EmptyState, ErrorState } from "../shared/data-state";

type FuelListType = { initialData: FuelTypePrice };

export default function FuelDataTable({ initialData }: FuelListType) {
  if (!initialData?.success)
    return (
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <ErrorState
          message={initialData?.error || "Fuel price data could not be loaded."}
        />
      </main>
    );

  const fuelName = initialData.name.toLowerCase();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Fuel price information"
        title={`Philippines ${fuelName} prices`}
        description="The latest available Philippine fuel information from GlobalPetrolPrices, organized by the source’s reported measures."
      />
      <DataDetails
        source={{
          name: "GlobalPetrolPrices",
          href: `https://www.globalpetrolprices.com/Philippines/${fuelName}_prices/`,
        }}
        date={initialData.date}
      >
        This is the data date supplied by the source. Price units and
        definitions appear in each section below.
      </DataDetails>

      {initialData.description ? (
        <p className="text-sm leading-6 text-slate-600">
          {initialData.description}
        </p>
      ) : null}

      {initialData.sections.length ? (
        <Accordion
          type="multiple"
          defaultValue={initialData.sections.map(
            (section, index) => section.id || `section-${index}`,
          )}
          className="space-y-3"
        >
          {initialData.sections.map((section, sectionIdx) => {
            const sectionKey = section.id || `section-${sectionIdx}`;

            return (
              <AccordionItem
                key={sectionKey}
                value={sectionKey}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <AccordionTrigger className="px-4 py-3 text-left font-semibold text-slate-950 hover:text-blue-800">
                  <span>{section.name}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <caption className="sr-only">
                        {section.name} for Philippines {fuelName} prices
                      </caption>
                      <tbody>
                        {section.items.map((item, itemIdx) => (
                          <tr
                            key={item.id || `${sectionKey}-item-${itemIdx}`}
                            className="border-b border-slate-100 last:border-0"
                          >
                            <th
                              scope="row"
                              className="px-3 py-2 text-left font-medium text-slate-800"
                            >
                              {item.specification}
                            </th>
                            <td className="px-3 py-2 text-slate-950">
                              {item.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        <EmptyState
          title="No fuel details are available"
          description="The source returned a fuel record without sections. Please check again later."
        />
      )}
    </main>
  );
}
