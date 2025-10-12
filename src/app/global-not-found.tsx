import Image from "next/image";
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="bg-gray-800 text-center flex items-center justify-center w-full h-screen">
        <header className="flex-col space-y-3">
          {" "}
          <Image
            src={"/not-found.svg"}
            alt="Page not found. Status: 404"
            height={400}
            width={900}
            className="w-[40vw] h-[40vh] "
          />
          <h3 className="text-white font-bold ">
            Oops... This is not the web page you are looking for.
          </h3>
          <Link href={"/dashboard"} className="text-white underline ">
            To Dashboard
          </Link>
        </header>
      </body>
    </html>
  );
}
