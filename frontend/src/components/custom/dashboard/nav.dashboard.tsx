"use client"
import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { NavDropdown, NavDropdownComm } from "../index/NavigationDropdown";
import OfflineNotifier from "../global/offlineNotify";

export function NavDashboard() {
  return (
    <header className={`w-full top-0 left-0 z-50`}>
            <header className="md:flex items-center justify-center w-full h-[3.5em] backdrop-blur-md px-11 max-sm:text-[10.2px] md:text-[13px]">
        <ul className="flex items-center justify-center max-sm:space-x-4 sm:space-x-7">
          <li className="mt-2 hover:underline text-blue-500">
            <a href="https://bettergov.ph/join-us"  target="_blank" rel="noopener noreferrer">&#128640; Join Us</a>
          </li>
            <li className="mt-2 hover:underline">
            <Link href={"/installation"}>Install App</Link>
          </li>
          <li className="mt-2 hover:underline">
            <Link href={"/about"}>About</Link>
          </li>
          
          {[["BetterGov.ph", "https://bettergov.ph/"]].map(([name, href], index) => {
          return (
            <li key={index} className="mt-2 hover:underline">
              <a href={href} target="_blank" rel="noreferrer noopener">{name}</a>
            </li>
          )
        })}
        </ul>
      </header>
      <main className="h-[4rem] w-full backdrop-blur-md flex justify-center md:justify-between items-center px-4 sm:px-8 shadow-sm">
         <section className="relative flex-col space-x-2.5 items-center justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              title="PriceGuides"
              src="/bettergov-icon.svg"
              alt="PriceGuides Logo"
              width={60}
              height={60}
              className="w-[20px] h-[20px] sm:w-[40px] sm:h-[40px]"
            />
            <p className="font-bold text-sm sm:text-lg">PriceGuides</p>
          
          </Link>
        </section>

        <section className="hidden md:flex  items-center space-x-4">
          <NavDropdownComm /> <NavDropdown />
         
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
      
      </main>   
       <OfflineNotifier />
    </header>
  );
}
