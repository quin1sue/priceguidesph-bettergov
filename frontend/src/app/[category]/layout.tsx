import { NavDashboard } from "@/components/custom/dashboard/nav.dashboard";
import { AppSidebar } from "@/components/custom/dashboard/sidebar";
import { TableSkeleton } from "@/components/custom/global/skeleton";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* navigation */}
      <NavDashboard />
      {/* main contents in the dashboard */}
      <main className="flex items-center overflow-hidden">
        <SidebarProvider>
          <AppSidebar />
    <SidebarTrigger className="absolute top-10 left-10 md:hidden" />
          <Suspense fallback={<TableSkeleton />}> 
            <main className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-7.5em)] w-full">
              <article className="mb-[6.5em]">
            {children}
              </article>
            </main>
          </Suspense>
        </SidebarProvider>
      </main>
    </>
  );
}
