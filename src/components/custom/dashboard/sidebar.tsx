import {
  Cigarette,
  ShoppingBasket,
  PlugZap,
  Fuel,
  PhilippinePeso,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Market Price Index",
    url: "/dashboard?where=daily-price-index",
    icon: ShoppingBasket,
  },
  {
    title: "Electricity kWh",
    url: "/dashboard?where=electricity-kwh",
    icon: PlugZap,
  },
  {
    title: "Cigarette Price Index",
    url: "/dashboard?where=cigarette",
    icon: Cigarette,
  },
  {
    title: "Gasoline Prices",
    url: "/dashboard?where=gasoline-prices",
    icon: Fuel,
  },
  { title: "Exchange Currency Rates", url: "/dashboard", icon: PhilippinePeso },
];

export function AppSidebar() {
  return (
    <Sidebar className="mt-[5em] overflow-hidden">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Index</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon color="blue" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
