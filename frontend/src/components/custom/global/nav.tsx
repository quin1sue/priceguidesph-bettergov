"use client"
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaDiscord, FaBars, FaTimes } from "react-icons/fa";
import { NavDropdown, NavDropdownComm, NavDropDownService } from "../index/NavigationDropdown";

interface NavProps {
  pos?: "fixed" | "static" | "relative";
}

export function Nav({ pos = "fixed" }: NavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef<HTMLElement>(null);

  const dashboardLinks = [
    ["Market Prices", "/dashboard?where=daily-price-index"],
    ["Cigarettes", "/dashboard?where=cigarettes-index"],
    ["Gasoline", "/dashboard?where=gasoline-prices"],
    ["Currency Exchange", "/dashboard?where=currency-exchange"],
  ];
  const bettergovLink = [
    ["Budget Tracker", "https://budget.bettergov.ph/2025/index.html"],
    ["Petitions", "https://petition.ph/"],
    ["Tax Directory", "https://taxdirectory.bettergov.ph/#/tax-calculators"],
    ["SALN Tracker", "https://saln.bettergov.ph/"],
    ["Hotlines", "https://hotlines.bettergov.ph/"],
    ["Open Bayan", "https://www.openbayan.org/"],
    ["Open Congress API", "https://open-congress-api.bettergov.ph/"],
    ["Open Gov Blockchain", "https://govchain.bettergov.ph/"]
  ];
  const socialLinks: [string, string][] = [
    ["Discord", "https://discord.com/invite/RpYZyCupuj" ],
    ["Github", "https://github.com/bettergovph"],
  ];

  // Update max-height when menu opens/closes
  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(isMobileMenuOpen ? menuRef.current.scrollHeight : 0);
    }
  }, [isMobileMenuOpen]);

  return (
    <header className={`${pos} w-full top-0 left-0 z-30`}>
      <header className="md:flex items-center justify-center w-full h-[2.5em] backdrop-blur-md px-11 max-sm:text-[9.5px] md:text-[13px]">
        <ul className="flex items-center justify-center max-sm:space-x-4 sm:space-x-7">
          <li className="mt-2 hover:underline text-blue-500">
            <a href="https://bettergov.ph/join-us"  target="_blank" rel="noopener noreferrer">&#128640; Join Us</a>
          </li>
          <li className="mt-2 hover:underline">
            <Link href={"/about"}>About</Link>
          </li>
          
          {[["BetterGov.ph", "https://bettergov.ph/"],
        ["Hotlines", "https://bettergov.ph/philippines/hotlines"]].map(([name, href], index) => {
          return (
            <li key={index} className="mt-2 hover:underline">
              <a href={href} target="_blank" rel="noreferrer noopener">{name}</a>
            </li>
          )
        })}
        </ul>
      </header>

      {/* main Navbar */}
      <main className="h-[4rem] w-full backdrop-blur-md flex justify-around items-center shadow-sm">
        <section className="flex space-x-2.5 items-center justify-center">
          <Image
            title="BetterGovPh"
            src={"/bettergov-icon.svg"}
            alt="BetterGov Icon"
            width={60}
            height={60}
            className="w-[25px] h-[25px] sm:w-[50px] sm:h-[50px]"
          />
          <Link href="/" className="flex items-center space-x-2">
            <p className="font-bold text-sm md:text-[15px]">PhPriceGuides by BetterGovPh</p>
          </Link>
        </section>

        <section className="hidden md:flex items-center space-x-4">
          <NavDropdownComm />
          <NavDropDownService />
          <NavDropdown />
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

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700 hover:text-gray-900 transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </main>

      
      <nav
        ref={menuRef}
        style={{ maxHeight: `${menuHeight}px` }}
        className={`md:hidden overflow-hidden px-4 transition-all duration-300 ease-in-out backdrop-blur-md fixed top-[4rem] left-0 w-full shadow-md flex flex-col space-y-2 z-40`}
      >
        <p className="border-t-2 border-gray-400 text-sm mt-2 pt-2 font-semibold">Services</p>
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
        <p className="border-t-2 border-gray-400 text-sm mt-2 pt-2 font-semibold">BetterGov Projects</p>
        {bettergovLink.map(([name, link], index) => (
          <a
            target="_blank"
            rel="noreferrer noopener"
            key={index}
            href={link}
            className="text-gray-700 font-medium hover:text-blue-500 transition hover:bg-gray-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {name}
          </a>
        ))}
        <p className="border-t-2 border-gray-400 text-sm mt-2 pt-2 font-semibold">Community</p>
        {socialLinks.map(([name, link], index) => (
          <a
            target="_blank"
            rel="noreferrer noopener"
            key={index}
            href={link}
            className="text-gray-700 font-medium hover:text-blue-500 transition hover:bg-gray-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {name}
          </a>
        ))}
      </nav>
    </header>
  );
}
