import {
  Cigarette,
  ShoppingBasket,
  PlugZap,
  Fuel,
  PhilippinePeso,
  ChartNoAxesGantt,
  BusFront,
  Bubbles,
  Waves,
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
import Link from "next/link";

// Menu items.
const items = [
  { title: "Exchange Currency Rates", url: "/dashboard", icon: PhilippinePeso },
  {
    title: "Market Price Index",
    url: "/dashboard?where=daily-price-index",
    icon: ShoppingBasket,
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
  {
    title: "Diesel Prices",
    url: "/dashboard?where=diesel",
    icon: Bubbles,
  },
  { title: "Kerosene Prices", url: "/dashboard?where=kerosene", icon: Waves },
];

const secondItems = [
  {
    title: "Daily Minimum Wage Rates",
    url: "https://nwpc.dole.gov.ph/#dmwr",
    icon: ChartNoAxesGantt,
  },
  {
    title: "Fare Rates",
    url: "https://ltfrb.gov.ph/fare-rates/",
    icon: BusFront,
  },
];
export function AppSidebar() {
  return (
    <Sidebar className="mt-[4em] overflow-hidden z-20">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Economic Indicators</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon color="blue" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarGroupLabel>External Sources</SidebarGroupLabel>
              {secondItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} target="_blank">
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
