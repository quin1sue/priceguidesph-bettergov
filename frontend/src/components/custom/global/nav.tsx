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
      <div className="h-[4rem] w-full backdrop-blur-md flex justify-between items-center px-4 sm:px-8 shadow-sm">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="EkonoTrack Logo"
            width={60}
            height={60}
            className="w-[40px] h-[40px]"
          />
          <span className="font-bold text-lg">EkonoTrack</span>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <DropDownNav />
          <Link
            href="https://github.com/quin1sue/ekonotrack-ph.bettergov"
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
        </div>

        {/* mobile responsive */}
        <button
          className="md:hidden text-gray-700 hover:text-gray-900 transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

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
