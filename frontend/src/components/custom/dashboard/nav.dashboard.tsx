"use client";

import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { NavDropdown, NavDropdownComm } from "../index/NavigationDropdown";
import OfflineNotifier from "../global/offlineNotify";
import { usePathname } from "next/navigation";
import { paths } from "@/lib/metadata";
import { IndicatorSearch } from "./indicator-search";
export function NavDashboard() {
  const pathname = usePathname();
  if (paths.includes(pathname)) return null;
  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        {/* Top Links */}
        <nav aria-label="Utility navigation" className="flex h-10 justify-center px-4 text-xs">
          <ul className="flex space-x-4 lg:space-x-8  items-center text-gray-700">
            <li className="hover:underline text-blue-600">
              <a
                href="https://bettergov.ph/join-us"
                target="_blank"
                rel="noopener noreferrer"
              >
                &#128640; Join Us
              </a>
            </li>
            <li className="hover:underline">
              <Link href="/installation">Install App</Link>
            </li>
            <li className="hover:underline">
              <Link href="/about">About</Link>
            </li>
            <li className="hover:underline">
              <a
                href="https://bettergov.ph/"
                target="_blank"
                rel="noopener noreferrer"
              >
                BetterGov.ph
              </a>
            </li>
          </ul>
        </nav>

        {/* Main Navbar */}
        <nav aria-label="Primary navigation" className="flex h-16 items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/bettergov-icon.svg"
              alt="PriceGuides Logo"
              width={40}
              height={40}
            />
            <span className="font-bold text-lg">PriceGuides</span>
          </Link>

          {/* Desktop Search */}
          <IndicatorSearch />

          {/* Right icons */}
          <div className="flex items-center space-x-4 max-md:hidden">
            <NavDropdownComm />
            <NavDropdown />
            <Link
              href="https://github.com/quin1sue/priceguidesph-bettergov"
              target="_blank"
            >
              <FaGithub
                size={20}
                className="text-gray-700 hover:text-gray-900 transition"
              />
            </Link>
            <Link href="https://discord.gg/RpYZyCupuj" target="_blank">
              <FaDiscord
                size={20}
                className="text-gray-700 hover:text-gray-900 transition"
              />
            </Link>
          </div>
        </nav>
        <IndicatorSearch mobile />
      </header>

      <OfflineNotifier />
    </>
  );
}
