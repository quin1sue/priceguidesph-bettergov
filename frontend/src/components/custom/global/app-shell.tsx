"use client";

import { usePathname } from "next/navigation";
import { NavDashboard } from "@/components/custom/dashboard/nav.dashboard";
import { AppSidebar } from "@/components/custom/dashboard/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { paths } from "@/lib/metadata";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalonePage = paths.includes(pathname);

  return (
    <SidebarProvider>
      <NavDashboard />
      <AppSidebar />
      {!isStandalonePage ? (
        <SidebarTrigger
          aria-label="Toggle navigation menu"
          className="fixed right-4 top-14 z-50 md:hidden"
        />
      ) : null}
      <main
        id="main-content"
        className={isStandalonePage ? "min-h-screen w-full" : "min-h-screen w-full pt-44 md:pt-28"}
      >
        {children}
      </main>
    </SidebarProvider>
  );
}
