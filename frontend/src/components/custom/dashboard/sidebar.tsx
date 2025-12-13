"use client";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { paths } from "@/lib/metadata";
import {
  Container,
  HandCoins,
  Handshake,
  LucideIcon,
  Store,
} from "lucide-react";

// Menu items.
const marketLinks = [
  { title: "Exchange Currency Rates", url: "/currency-exchange" },
  {
    title: "Market Price Index",
    url: "/daily-price-index",
  },
  {
    title: "Drug Price Index",
    url: "/drug-price-index",
  },
  {
    title: "Cigarette Price Index",
    url: "/cigarette-index",
  },
  {
    title: "Gasoline Prices",
    url: "/gasoline",
  },
  {
    title: "LPG Prices",
    url: "/lpg",
  },
  {
    title: "Diesel Prices",
    url: "/diesel",
  },
  { title: "Kerosene Prices", url: "/kerosene" },
];

const indicatorLinks: {
  category: string;
  icon: LucideIcon;
  data: {
    url: string;
    title: string;
  }[];
}[] = [
  {
    category: "Social",
    icon: Handshake,
    data: [
      {
        url: "/indicator/SP.DYN.LE00.IN",
        title: "Life expectancy at birth",
      },
      {
        url: "/indicator/SM.POP.TOTL.ZS",
        title: "International migrant stock",
      },
      {
        url: "SH.H2O.BASW.ZS",
        title: "People using water services",
      },
    ],
  },
  {
    category: "Economic",
    icon: HandCoins,
    data: [
      {
        url: "/indicator/NY.GDP.PCAP.KD.ZG",
        title: "GDP per capita growth",
      },
      {
        url: "/indicator/BX.TRF.PWKR.CD.DT",
        title: "Personal remittances",
      },
      {
        url: "/indicator/NY.GDP.MINR.RT.ZS",
        title: "Mineral rents % of GDP",
      },
      {
        url: "/indicator/NY.GDP.COAL.RT.ZS",
        title: "Coal rents % of GDP",
      },
    ],
  },
  {
    category: "Environment",
    icon: Container,
    data: [
      {
        url: "/indicator/AG.LND.FRST.ZS",
        title: "Forest area (% of land area)",
      },
      {
        url: "/indicator/EN.GHG.CH4.WA.MT.CE.AR5",
        title: "Methane emissions from Waste",
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  if (paths.includes(pathname)) return null;
  return (
    <Sidebar className={`no-scrollbar mt-[7em] z-20`}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Store />
            &nbsp;Market Prices
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {marketLinks.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-blue-500 hover:text-white"
                  >
                    <Link
                      href={item.url}
                      className={`${
                        pathname === item.url
                          ? "underline decoration-white bg-blue-500 text-white"
                          : ""
                      }`}
                    >
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarSeparator />
          {indicatorLinks.map((label, index) => {
            return (
              <div key={index}>
                <SidebarGroupLabel>
                  {<label.icon />}&nbsp; {label.category}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {label.data.map((attribute, index) => {
                      return (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton
                            asChild
                            className="hover:bg-blue-500 hover:text-white"
                          >
                            <Link
                              href={attribute.url}
                              className={`${
                                pathname === attribute.url
                                  ? "underline decoration-white bg-blue-500 text-white"
                                  : ""
                              }`}
                            >
                              {attribute.title}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
                <SidebarSeparator />
              </div>
            );
          })}
          <p className="font-semibold text-sm ml-2 text-gray-700 mt-2">
            1500+ more data
          </p>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
