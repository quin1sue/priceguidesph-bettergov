import Image from "next/image";
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found | Price Guides",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex h-screen w-full items-center justify-center text-center text-gray-600">
        <header className="flex-col space-y-3">
          <Image
            src={"/not-found.svg"}
            alt="Page not found. Status: 404"
            height={400}
            width={900}
            className="w-[40vw] h-[40vh] "
          />
          <h3 className="font-bold">
            Oops... This is not the web page you are looking for.
          </h3>
          <Link href={"/"} className="underline ">
            To Dashboard
          </Link>
        </header>
      </body>
    </html>
  );
}
