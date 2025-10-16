import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { DropDownNav } from "../global/dropdown";

export function NavDashboard() {
  return (
    <header className={`w-full top-0 left-0 z-50`}>
      <main className="h-[4rem] w-full backdrop-blur-md flex justify-center md:justify-between items-center px-4 sm:px-8 shadow-sm">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Philippine Price Guides Logo"
            width={60}
            height={60}
            className="w-[40px] h-[40px]"
          />
          <span className="font-bold text-lg">PhPriceGuides</span>
        </Link>

        <section className="hidden md:flex  items-center space-x-4">
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
      </main>
    </header>
  );
}
