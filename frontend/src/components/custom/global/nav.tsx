"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaDiscord, FaBars, FaTimes } from "react-icons/fa";
import { DropDownNav } from "./dropdown";

interface NavProps {
  pos?: "fixed" | "static" | "relative";
}

export function Nav({ pos = "fixed" }: NavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dashboardLinks = [
    ["Market Prices", "/dashboard?where=daily-price-index"],
    ["Cigarettes", "/dashboard?where=cigarettes-index"],
    ["Gasoline", "/dashboard?where=gasoline-prices"],
    ["Currency Exchange", "/dashboard?where=currency-exchange"],
  ];

  return (
    <header className={`${pos} w-full top-0 left-0 z-50`}>
      <main className="h-[4rem] w-full backdrop-blur-md flex justify-between items-center px-4 sm:px-8 shadow-sm">
        <section>
          <Link href="/" className="flex items-center space-x-2">
            <Image
              title="PhPriceGuides"
              src="/logo.svg"
              alt="PhPriceGuides Logo"
              width={60}
              height={60}
              className="w-[40px] h-[40px]"
            />
            <p className="font-bold text-lg">PhPriceGuides</p>
            <Image
              title="BetterGovPh"
              src={"/bettergov-icon.svg"}
              alt="BetterGov Icon"
              width={60}
              height={60}
              className="w-[40px] h-[40px]"
            />
          </Link>
        </section>

        <section className="hidden md:flex items-center space-x-4">
          <DropDownNav />
          <Link
            href="https://github.com/quin1sue/priceguidesph-bettergov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 transition"
          >
            <FaGithub size={20} />
          </Link>
          <Link
            href="https://discord.gg/RpYZyCupuj"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 transition"
          >
            <FaDiscord size={20} />
          </Link>
        </section>

        {/* mobile responsive */}
        <button
          className="md:hidden text-gray-700 hover:text-gray-900 transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </main>
      {/* dashboardlinks */}
      <header className="hidden md:block border-t-[1px] border-gray-200 w-full h-[2.5em] backdrop-blur-md pl-10 font-bold text-[13px]">
        <ul className="flex items-center space-x-7">
          {dashboardLinks.map(([name, href], index) => {
            return (
              <li key={index} className="mt-2 hover:underline">
                <Link href={href}>{name}</Link>
              </li>
            );
          })}
        </ul>
      </header>
      {isMobileMenuOpen && (
        <nav className="md:hidden fixed top-[4rem] left-0 w-full backdrop-blur-md shadow-md flex flex-col space-y-2 p-4 z-40">
          {dashboardLinks.map(([name, link], index) => (
            <Link
              key={index}
              href={link}
              className="text-gray-700 font-medium hover:text-blue-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
