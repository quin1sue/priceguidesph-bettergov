import Link from "next/link";
import Image from "next/image";
export function Logo() {
  return (
    <main>
      <Link href={"/"} className="flex items-center">
        {" "}
        <Image
          src={"/logo.svg"}
          alt="ekono track logo"
          height={900}
          width={900}
          className="w-[60px]"
        />
        <p className="font-bold text-xl">PhPriceGuides</p>
      </Link>
      <small>promoting transparency and awareness.</small>
    </main>
  );
}
