import Image from "next/image";
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Page Not Found | Price Guides",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body  className={`${inter.className} text-gray-600 text-center flex items-center justify-center w-full h-screen`}>
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
          <Link href={"/dashboard"} className="underline ">
            To Dashboard
          </Link>
        </header>
      </body>
    </html>
  );
}
