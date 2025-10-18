import Image from "next/image";

export default function DataSource() {
  const sources = [
    {
      name: "FX Rates",
      logo: "/fxrates-logo.png",
      link: "https://fxratesapi.com/",
      description: "Reliable currency exchange rates",
    },
    {
      name: "Department of Agriculture",
      logo: "/DA-logo.svg",
      link: "https://www.da.gov.ph/price-monitoring/",
      description: "Official agricultural market data",
    },
    {
      name: "GlobalPetrolPrices",
      logo: "/globalpetrol-logo.png",
      link: "https://www.globalpetrolprices.com/Philippines",
      description: "Worldwide fuel price trends",
    },
  ];

  return (
    <section
      aria-labelledby="data-sources-title"
      className="z-50 w-full py-12 px-4 sm:px-8 bg-white border-t border-gray-200"
    >
      <div className="z-50 max-w-5xl mx-auto text-center">
        <h2
          id="data-sources-title"
          className="z-50 text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
        >
          Our Data Sources
        </h2>
        <p className="text-gray-600 mb-10 text-sm sm:text-base max-w-2xl mx-auto">
          We collect data from trusted and authoritative sources to provide accurate
          and up-to-date information you can rely on.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-10">
          {sources.map((source, idx) => (
            <figure
              key={idx}
              className="w-28 sm:w-32 flex flex-col items-center text-center group transition transform hover:scale-105"
            >
                <a className="text-sm hover:underline font-bold mb-2" href={source.link} target="_blank" rel="noreferrer noopener">{source.name}</a>
              <div className="w-full h-12 relative mb-2">
                <Image
                  src={source.logo}
                  alt={source.name}
                  fill
                  className="object-contain"
                />
              </div>
              <figcaption className="text-xs sm:text-sm text-gray-700 group-hover:text-blue-600 transition">
                {source.description}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
