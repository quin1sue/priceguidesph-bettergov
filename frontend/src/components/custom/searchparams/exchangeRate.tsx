"use client";

import { useState } from "react";
import { CurrencyRatesType } from "@/functions/types";
import { DashboardError } from "../dashboard/error-occured";

type CurrencyType = {
  initialData: CurrencyRatesType;
};

const FxRates = ({ initialData }: CurrencyType) => {
  const [rates] = useState<Record<string, number>>(initialData.rates);
  const [search, setSearch] = useState("");

  // Currency converter states
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [result, setResult] = useState<number | null>(null);

  const handleConvert = () => {
    if (fromCurrency === "PHP") {
      setResult(amount); 
      return;
    }

    const rate = rates[fromCurrency];
    if (!rate) return setResult(null);

    const phpValue = amount / rate;
    setResult(phpValue);
  };

  // filter currencies via search
  const filtered = Object.entries(rates).filter(([currency]) =>
    currency.toLowerCase().includes(search.toLowerCase())
  );
  if (!initialData.success) return <DashboardError message={initialData.error} />
  return (
        <>
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

      {/* currency Converter */}
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

      {/* exchange Rates List */}
      <section aria-label="Exchange Rates">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          All Currency Rates Base&#58; &#40;PHP&#41;
        </h3>
        {filtered.length > 0 ? (
          <ul className="divide-y border border-gray-200 rounded-lg shadow-sm">
            {filtered.map(([currency, rate]) => (
              <li
                key={currency}
                className="flex justify-between p-4 hover:bg-gray-50 text-sm"
              >
                <span className="font-medium text-gray-700">{currency}</span>
                <span className="text-gray-900">&#8369;{(1 / rate).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No matching currencies found.</p>
        )}
      </section>
    </>
  );
};

export default FxRates;
