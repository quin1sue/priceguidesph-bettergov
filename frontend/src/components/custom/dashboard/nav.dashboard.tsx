"use client";

import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { NavDropdown, NavDropdownComm } from "../index/NavigationDropdown";
import OfflineNotifier from "../global/offlineNotify";
import { useIndicators } from "@/lib/context/indicator";
import { useState, useMemo, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { paths } from "@/lib/metadata";
export function NavDashboard() {
  const indicator = useIndicators();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(0);

  //refs for desktop and mobile
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Flatten all indicators for search
  const allIndicators = useMemo(
    () => indicator.data?.result || [],
    [indicator]
  );

  // Filtered suggestions
  const suggestions = useMemo(() => {
    if (!search) return [];
    return allIndicators
      .filter((ind) =>
        ind.indicatorName.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 10);
  }, [search, allIndicators]);

  // click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !desktopRef.current?.contains(e.target as Node) &&
        !mobileRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Render suggestions dropdown
  const renderSuggestions = () => (
    <ul className="absolute z-[9999] top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
      {suggestions.map((s, index) => {
        const startIdx = s.indicatorName
          .toLowerCase()
          .indexOf(search.toLowerCase());
        const endIdx = startIdx + search.length;

        return (
          <li key={s.slug}>
            <Link
              href={`/indicator/${s.slug}`}
              className={`block w-full text-left px-3 py-2 hover:bg-blue-100 justify-between items-center ${
                index === highlighted ? "bg-blue-100 font-semibold" : ""
              }`}
              onClick={() => {
                setShowSuggestions(false);
                setSearch("");
              }}
            >
              <span>
                {startIdx !== -1 ? (
                  <>
                    {s.indicatorName.slice(0, startIdx)}
                    <span className="bg-yellow-200">
                      {s.indicatorName.slice(startIdx, endIdx)}
                    </span>
                    {s.indicatorName.slice(endIdx)}
                  </>
                ) : (
                  s.indicatorName
                )}
              </span>
              <span className="ml-2 text-xs text-gray-400">{s.category}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
  if (paths.includes(pathname)) return null;
  return (
    <>
      <header className="fixed w-full top-0 left-0 z-50 shadow-md bg-white/80 backdrop-blur-md">
        {/* Top Links */}
        <div className="flex justify-center h-[3.5em] max-sm:text-[10px] text-[12px] px-11">
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
        </div>

        {/* Main Navbar */}
        <div className="flex justify-between items-center h-16 px-4 md:px-8">
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
          <div
            ref={desktopRef}
            className="relative flex-1 max-w-md mx-4 md:mx-0 hidden md:flex items-center"
          >
            <Search size={18} className="text-blue-500 mr-2" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
                setHighlighted(0);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search data e.g GDP, employment rate..."
              className="w-full border border-gray-300 rounded-md h-10 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showSuggestions && suggestions.length > 0 && renderSuggestions()}
          </div>

          {/* Right icons */}
          <div className="flex items-center space-x-4">
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
        </div>

        {/* mobile Search */}
        <div
          ref={mobileRef}
          className="relative flex-1 max-w-md mx-4 md:mx-0 flex md:hidden items-center mt-2"
        >
          <Search size={18} className="text-blue-500 mr-2" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
              setHighlighted(0);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search data e.g GDP, employment rate..."
            className="w-full border border-gray-300 rounded-md h-10 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showSuggestions && suggestions.length > 0 && renderSuggestions()}
        </div>
      </header>

      <OfflineNotifier />
    </>
  );
}
