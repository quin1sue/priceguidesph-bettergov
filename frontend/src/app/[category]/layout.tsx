import { NavDashboard } from "@/components/custom/dashboard/nav.dashboard";
import { AppSidebar } from "@/components/custom/dashboard/sidebar";
import { TableSkeleton } from "@/components/custom/global/skeleton";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { IndicatorProvider } from "@/lib/context/indicator";
import { Suspense } from "react";

export default function Component({ children }: { children: React.ReactNode }) {

  return (
    <>
    <IndicatorProvider>
      <NavDashboard />
      <main className="flex items-center overflow-hidden relative">
        <SidebarProvider>
          <AppSidebar/>

          {/* mobile sidebar trigger */}
          <SidebarTrigger className="fixed top-14.5 z-50 right-25 md:hidden" />
          <Suspense fallback={<TableSkeleton />}>
            <main className="space-y-6 p-4 overflow-y-auto h-[calc(100vh)] w-full">
              <article className="mt-[7.5em]">
                {children} 
              </article>
            </main>
          </Suspense>
        </SidebarProvider>
      </main>
   </IndicatorProvider> </>
  );
}
