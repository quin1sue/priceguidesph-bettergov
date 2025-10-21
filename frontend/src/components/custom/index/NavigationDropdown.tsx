"use client"

import * as React from "react"
import Link from "next/link"
import { FaGithub, FaDiscord, FaFacebook } from "react-icons/fa"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { IconType } from "react-icons/lib"

const servicesLink = [
  ["Currency Rates", "/currency-exchange"],
  ["Market Price Index", "/daily-price-index"],
  ["Cigarette", "/cigarette-index"],
  ["Gasoline", "/gasoline"],
  ["Diesel", "/diesel"],
  ["Kerosene", "/kerosene"],
  ["LPG", "/lpg"]
]

const bettergovLink = [
  ["Budget Tracker", "https://budget.bettergov.ph/2025/index.html"],
  ["Petitions", "https://petition.ph/"],
  ["Tax Directory", "https://taxdirectory.bettergov.ph/#/tax-calculators"],
  ["SALN Tracker", "https://saln.bettergov.ph/"],
  ["Hotlines", "https://hotlines.bettergov.ph/"],
  ["Open Bayan", "https://www.openbayan.org/"],
  ["Open Congress API", "https://open-congress-api.bettergov.ph/"],
  ["Open Gov Blockchain", "https://govchain.bettergov.ph/"]
]

const socialLinks: [string, string, IconType][] = [
  ["Discord", "https://discord.com/invite/RpYZyCupuj", FaDiscord],
  ["Facebook", "https://www.facebook.com/bettergovph", FaFacebook],
  ["Github", "https://github.com/bettergovph", FaGithub],
];
export function NavDropdownComm() {
  const isMobile = useIsMobile()

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="flex-wrap">
         
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger>Community</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4 z-50">
             <li> {socialLinks.map(([name, href, Icon], index) => {
                return (
                   <NavigationMenuLink asChild key={index}>
                  <a target="_blank" rel="noreferrer noopener" href={href} className="flex-row items-center gap-2">
                   <Icon /> {name} 
                  </a>
                </NavigationMenuLink>
                )
              })}</li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
export function NavDropDownService() {
const isMobile = useIsMobile()

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="flex-wrap">
         
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger>Services</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4 z-50">
             <li> {servicesLink.map(([name, href], index) => {
                return (
                   <NavigationMenuLink asChild key={index}>
                  <Link href={href} className="flex-row items-center gap-2">
                    {name}
                  </Link>
                </NavigationMenuLink>
                )
              })}</li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
export function NavDropdown() {
  const isMobile = useIsMobile()

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="flex-wrap">
         
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger>BetterGov Projects</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4 z-50">
             <li> {bettergovLink.map(([name, href], index) => {
                return (
                   <NavigationMenuLink asChild key={index}>
                  <a target="_blank" rel="noreferrer noopener" href={href} className="flex-row items-center gap-2">
                     {name}
                  </a>
                </NavigationMenuLink>
                )
              })}</li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
