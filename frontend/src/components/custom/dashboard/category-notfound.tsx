import Image from "next/image";

export const NotFound = () => {
  return (
    <main className="flex flex-col md:flex-row items-center justify-center text-center md:text-left w-full h-[calc(100vh-7.5em)] px-6 gap-10">
      <Image
        width={800}
        height={800}
        alt="Category not found illustration"
        src="/category-notfound.svg"
        className="w-[16em] md:w-[20em] h-auto"
        priority
      />

      <article className="max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-blue-700">
          Oops&#33; We couldn&#39;t find that category&#183;
        </h1>

        <p className="text-gray-700 leading-relaxed">
          Looks like the category you&#39;re searching for isn&#39;t available yet on{" "}
          <span className="font-semibold text-blue-800">Price Guides PH</span>&#183;
          We&#39;re constantly adding new data sources to keep things up to date&#33;
        </p>

        <p className="text-gray-700 leading-relaxed">
          Got a reliable source for market prices, fuel costs, or anything else
          related&#63;
          <br />
          We&#39;d love to check it out and include it in our platform&#183;
        </p>

        <a
          href="https://discord.gg/RpYZyCupuj"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 bg-blue-700 hover:bg-blue-800 text-white font-medium px-5 py-2 rounded-2xl shadow-md transition-all"
        >
          Suggest a Data Source
        </a>
      </article>
    </main>
  );
};
