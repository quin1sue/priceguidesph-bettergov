"use client";
import React, { useEffect, useState } from "react";

export const FxRates: React.FC = () => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          `https://api.fxratesapi.com/latest?api_key=${process.env.NEXT_PUBLIC_FXRATES_API_KEY}&base=PHP&format=json&places=2&amount=1`
        );
        setLoading(true);
        if (!response.ok) throw new Error("Failed to fetch exchange rates");

        const result = await response.json();
        const invertedRates: Record<string, number> = {};
        for (const [currency, rate] of Object.entries(result.rates)) {
          invertedRates[currency] = 1 / (rate as number);
        }

        setRates(invertedRates);
      } catch (err) {
        setError("An error has occured: " + err);
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  const filteredRates = Object.entries(rates).filter(([currency]) =>
    currency.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-4">Loading exchange rates...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <section className="p-4 space-y-4 w-full h-[calc(100vh-5em)] overflow-y-auto">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-around gap-4">
        <input
          type="text"
          placeholder="Search currency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-600/50 rounded-md p-2 w-full md:w-64"
        />
        <h2 className="text-xl font-semibold">PHP Exchange Rates</h2>
      </header>

      {filteredRates.length > 0 ? (
        <ul className="divide-y border rounded-lg">
          {filteredRates.map(([currency, rate]) => (
            <li
              key={currency}
              className="flex justify-between p-7 hover:bg-gray-50"
            >
              <span className="font-medium">{currency}</span>
              <span>&#8369;{rate.toFixed(6)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No matching currencies found.</p>
      )}
    </section>
  );
};
