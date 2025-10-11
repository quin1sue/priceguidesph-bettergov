import Link from "next/link";
import { PhilippinePeso } from "lucide-react";
export function Logo() {
  return (
    <>
      <Link href={"/"} className="flex items-center">
        {" "}
        <PhilippinePeso color="blue" size={30} strokeWidth={2} />{" "}
        <span className="font-bold text-xl">EkonoTrack</span>
      </Link>
    </>
  );
}
