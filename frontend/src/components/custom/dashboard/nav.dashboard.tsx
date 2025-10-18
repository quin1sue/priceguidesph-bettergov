
import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { NavDropdown, NavDropdownComm } from "../index/NavigationDropdown";

export function NavDashboard() {
  return (
    <header className={`w-full top-0 left-0 z-50`}>
      <main className="h-[4rem] w-full backdrop-blur-md flex justify-center md:justify-between items-center px-4 sm:px-8 shadow-sm">
         <section className="relative flex-col space-x-2.5 items-center justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              title="PhPriceGuides"
              src="/bettergov-icon.svg"
              alt="PhPriceGuides Logo"
              width={60}
              height={60}
              className="w-[20px] h-[20px] sm:w-[40px] sm:h-[40px]"
            />
            <p className="font-bold text-sm sm:text-lg">PhPriceGuides</p>
          
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
     
    </header>
  );
}
