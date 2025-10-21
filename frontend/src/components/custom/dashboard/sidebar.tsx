import {
  Cigarette,
  ShoppingBasket,
  Fuel,
  PhilippinePeso,
  ChartNoAxesGantt,
  BusFront,
  Bubbles,
  Waves,
} from "lucide-react";
import { PiGasCan } from "react-icons/pi";
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
  { title: "Exchange Currency Rates", url: "/currency-exchange", icon: PhilippinePeso },
  {
    title: "Market Price Index",
    url: "/daily-price-index",
    icon: ShoppingBasket,
  },
  {
    title: "Cigarette Price Index",
    url: "/cigarette-index",
    icon: Cigarette,
  },
  {
    title: "Gasoline Prices",
    url: "/gasoline",
    icon: Fuel,
  },
  {
    title: "LPG Prices",
    url: "/lpg",
    icon: PiGasCan
  },
  {
    title: "Diesel Prices",
    url: "/diesel",
    icon: Bubbles,
  },
  { title: "Kerosene Prices", url: "/kerosene", icon: Waves },
];

const externalSources = [
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
    <Sidebar className="mt-[6.1em] overflow-hidden z-20">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Economic Indicators </SidebarGroupLabel>
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
              {externalSources.map((item) => (
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
