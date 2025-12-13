"use client";
import Link from "next/link";
import Image from "next/image";
import { FaDiscord } from "react-icons/fa";
import { Github } from "lucide-react";
export const Footer = ({ pos }: { pos?: string }) => {
  const community: [string, string, React.ComponentType<{ size?: number }>][] =
    [
      ["Discord", "https://discord.gg/RpYZyCupuj", FaDiscord],
      [
        "Contributions are welcome!",
        "https://github.com/quin1sue/priceguidesph-bettergov",
        Github,
      ],
    ];

  return (
    <footer
      className={`bg-gray-900 ${pos} w-full text-white py-12 px-6 border-t pb-safe`}
    >
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <article>
          <header>
            <Link
              href="/about"
              className="text-white font-semibold text-lg mb-4"
            >
              About
            </Link>
          </header>
          <p className="text-sm leading-relaxed text-gray-400">
            <strong>PriceGuides</strong> provides economic and financial
            transparency for the Philippines. Tracking fuel, energy, and market
            data to help citizens stay informed.
          </p>

          <section className="mt-2 pt-2 flex flex-col gap-2 text-sm font-bold border-gray-600 border-t-[1px]">
            <article className="flex items-center gap-2">
              <Image
                src="/bettergov-icon-white.png"
                alt="BetterGov Icon"
                height={1000}
                width={1000}
                className="h-[47px] w-[47px]"
              />
              <a
                href="https://bettergov.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                BetterGovPh
              </a>
            </article>
            <article className="flex items-center gap-2">
              <Image
                src="/icon.png"
                alt="PriceGuides Icon"
                height={1000}
                width={1000}
                className="h-[47px] w-[47px]"
              />
              <Link href="/" className="hover:underline">
                PriceGuides
              </Link>
            </article>
          </section>
        </article>

        {/* Services */}
        <article>
          <header>
            <h3 className="text-white font-semibold text-lg mb-4">Services</h3>
          </header>
          <ul className="space-y-2 text-sm">
            {[
              ["Gasoline Prices", "/gasoline"],
              ["Kerosene Prices", "/kerosene"],
              ["Diesel Prices", "/diesel"],
              ["Market Prices", "/daily-price-index"],
              ["Cigarette Prices", "/cigarette-index"],
              ["Drug Prices", "/drug-price-index"],
            ].map(([name, link], idx) => (
              <li key={idx}>
                <Link
                  href={link}
                  className="hover:text-blue-700 text-white transition"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </article>

        {/* Government Links */}
        <article>
          <header>
            <h3 className="text-white font-semibold text-lg mb-4">
              Government Links
            </h3>
          </header>
          <ul className="space-y-2 text-sm">
            {[
              ["Philippine Statistics Authority (PSA)", "https://psa.gov.ph"],
              ["Department of Energy (DOE)", "https://www.doe.gov.ph"],
              [
                "Department of Trade and Industry (DTI)",
                "https://www.dti.gov.ph",
              ],
              ["Bangko Sentral ng Pilipinas (BSP)", "https://www.bsp.gov.ph"],
            ].map(([name, link], idx) => (
              <li key={idx}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-700 transition"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </article>

        {/* Community */}
        <article>
          <header>
            <h3 className="text-white font-semibold text-lg mb-4">Community</h3>
          </header>
          <ul className="flex flex-col gap-3 text-sm">
            {community.map(([name, link, Icon], idx) => (
              <li key={idx}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-blue-700 transition"
                >
                  <Icon size={20} />
                  <span>{name}</span>
                </a>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
        &copy; 2025{" "}
        <span className="font-semibold text-white">PriceGuides</span> by{" "}
        <span className="font-semibold text-white">BetterGov.ph</span> — See
        sources for their respective licenses
      </section>
    </footer>
  );
};
