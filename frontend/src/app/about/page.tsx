"use client";
import { Nav } from "@/components/custom/global/nav";
import Image from "next/image";
import { Database, Clock, Github, Globe } from "lucide-react";
import { Footer } from "@/components/custom/global/footer";

export default function Page() {
  return (
    <>
      <Nav pos="fixed" />
      <main className="mt-[10px] min-h-screen w-full flex flex-col items-center bg-gray-50 pt-[6rem] px-4 sm:px-8">
        <article className="flex text-sm flex-col items-center max-w-4xl space-y-8 text-gray-700">
          <Image
            src="/ekonotrack-banner-blue.png"
            alt="EkonoTrack Banner"
            width={900}
            height={900}
            className="w-full max-w-3xl rounded-lg shadow-md"
          />
          <section className="flex flex-col items-start space-y-2 w-full">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" /> What is EkonoTrack?
            </h2>
            <p className="text-gray-600">
              &#8226; EkonoTrack is a public data platform that tracks essential
              economic information such as market prices, fuel prices, currency
              exchange rates, and other key indicators — promoting transparency
              and awareness.
            </p>
          </section>
          <section className="flex flex-col items-start space-y-2 w-full">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-green-500" /> Where do we get
              our sources?
            </h2>
            <p className="text-gray-600">
              &#8226; Data is collected from reliable sources including
              government agencies, official market reports, and verified
              financial institutions.
            </p>
          </section>
          <section className="flex flex-col items-start space-y-2 w-full">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" /> When does the data
              get updated?
            </h2>
            <p className="text-gray-600">
              &#8226; Data is updated in near real-time depending on the source.
              Market prices and currency rates are refreshed frequently to
              provide the latest information.
            </p>
          </section>
          <section className="flex flex-col items-start space-y-2 w-full">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Github className="w-5 h-5 text-gray-800" /> Is EkonoTrack open
              source?
            </h2>
            <p className="text-gray-600">
              &#8226; Yes! EkonoTrack is open source. You can explore,
              contribute, or deploy your own instance via our GitHub repository.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
