import { NavDashboard } from "@/components/custom/dashboard/nav.dashboard";
import { AppSidebar } from "@/components/custom/dashboard/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};
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
          {children}
        </SidebarProvider>
      </main>
    </>
  );
}
