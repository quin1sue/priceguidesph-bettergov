"use client";

import React, { useEffect, useState } from "react";
import { TableSkeleton } from "../global/skeleton";

export const FxRates: React.FC = () => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  //rate converter
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch("/api/fxrates/", { method: "GET" });
        if (!response.ok) throw new Error("Failed to fetch exchange rates");

        const result = await response.json();

        setRates(result.rates);
      } catch (err) {
        setError(("An error has occurred: " + err) as string);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  // TOOK ME AN HOUR TO DO THIS [im bad with numbers]
  const handleConvert = () => {
    const rateToPHP = rates["PHP"]; // 1 USD = ? PHP
    if (!rateToPHP) return setResult(null);

    // If converting from another currency to PHP
    if (fromCurrency !== "USD") {
      const fromRate = rates[fromCurrency];
      if (!fromRate) return setResult(null);

      // Convert from X -> USD -> PHP
      const usdEquivalent = amount / fromRate;
      setResult(usdEquivalent * rateToPHP);
    } else {
      // Directly USD → PHP
      setResult(amount * rateToPHP);
    }
  };

  const filtered = Object.entries(rates).filter(([currency]) =>
    currency.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <TableSkeleton />;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <main className="p-4 space-y-6 w-full h-[calc(100vh-5em)] overflow-y-auto">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-blue-700">
          PHP Exchange Rates
        </h2>
        <input
          type="text"
          placeholder="Search currency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-700/50 rounded-md p-2 w-full md:w-64"
        />
      </header>

      {/* currency calc */}
      <section className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Currency Converter
        </h3>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-2 w-full md:w-32"
            placeholder="Amount"
          />
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full md:w-40"
          >
            {Object.keys(rates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <button
            onClick={handleConvert}
            className="bg-blue-700 text-white rounded-md px-4 py-2 hover:bg-blue-800 transition"
          >
            Convert to PHP
          </button>
        </div>

        {result !== null && (
          <p className="mt-4 text-lg font-medium text-gray-900">
            {amount} {fromCurrency} ={" "}
            <span className="text-blue-700 font-semibold">
              &#8369;{result.toFixed(2)}
            </span>
          </p>
        )}
      </section>

      {/* exchange rates list */}
      <section aria-label="Exchange Rates">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          All Currency Rates &#40;Base&#58; PHP&#41;
        </h3>
        {filtered.length > 0 ? (
          <ul className="divide-y border border-gray-200 rounded-lg bg-white shadow-sm">
            {filtered.map(([currency, rate]) => (
              <li
                key={currency}
                className="flex justify-between p-4 hover:bg-gray-50 text-sm"
              >
                <span className="font-medium text-gray-700">{currency}</span>
                <span className="text-gray-900">₱{rate.toFixed(4)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No matching currencies found.</p>
        )}
      </section>
    </main>
  );
};
