import Link from "next/link";
import { Logo } from "./logo";
import { DropDownNav } from "./dropdown";

export function Nav({
  pos = "fixed",
}: {
  pos?: "fixed" | "relative" | "static";
}) {
  return (
    <nav
      className={`h-[5em] w-full ${pos} inset-0 top-0 backdrop-blur-md z-50 flex justify-between items-center px-10 shadow-sm`}
    >
      <Logo />

      <ul className="flex items-center space-x-6 text-gray-800 font-medium">
        {[
          ["Market Prices", "/dashboard?where=daily-price-index"],
          ["Currency Exchange", "/dashboard"], // default
          ["Bills & Utilities", "/dashboard?where=gasoline-prices"],
        ].map(([name, link], index) => (
          <li key={index}>
            <Link
              href={link}
              className="transition hover:text-blue-500 hover:underline underline-offset-4"
            >
              {name}
            </Link>
          </li>
        ))}

        <li>
          <DropDownNav />
        </li>
      </ul>
    </nav>
  );
}
