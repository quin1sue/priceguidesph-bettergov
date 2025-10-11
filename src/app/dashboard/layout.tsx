import { AppSidebar } from "@/components/custom/dashboard/sidebar";
import { Nav } from "@/components/custom/global/nav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav pos="static" />

      <main className="flex items-center overflow-hidden">
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          {children}
        </SidebarProvider>
      </main>
    </>
  );
}
