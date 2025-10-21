"use client";

import { JSX, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Euro,
  Activity,
  CreditCard,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export const HeroIndex = () => {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const displayCurrencies = ["USD", "EUR", "JPY", "SAR"];
  const currencyIcons: Record<string, JSX.Element> = {
    USD: <DollarSign className="w-5 h-5 text-blue-500" />,
    EUR: <Euro className="w-5 h-5 text-blue-500" />,
    JPY: <Activity className="w-5 h-5 text-blue-500" />,
    SAR: <CreditCard className="w-5 h-5 text-blue-500" />,
  };
  const flags: Record<string, string> = {
    USD: "🇺🇸",
    EUR: "🇪🇺",
    JPY: "🇯🇵",
    SAR: "🇸🇦",
  };

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setError(null);
        const response = await fetch("/api/fxrates");
        if (!response.ok) throw new Error("Failed to fetch exchange rates");

        const result = await response.json();
        if (!result.rates) throw new Error("Invalid response data");

        const invertedRates: Record<string, number> = {};
        for (const [currency, rate] of Object.entries(result.rates)) {
          invertedRates[currency] = 1 / (rate as number);
        }

        setRates(invertedRates);
        setLastUpdated(new Date());
      } catch (err) {
        console.error(err);
        setError("Unable to load exchange rates right now.");
      }
    };

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayCurrencies.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [displayCurrencies.length]);

  const currentCurrency = displayCurrencies[currentIndex];

  return (
    <section className="mt-20 relative w-full bg-gradient-to-br from-blue-50 via-white to-white overflow-hidden">
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start min-h-[70vh]">
        {/* LEFT CONTENT */}
        <article className="z-20 md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-4 max-w-md">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            Track Essential Data <br />
            <span className="text-blue-600">with Transparency</span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Real-time insights on exchange rates, fuel prices, and market trends
            — empowering you with reliable and transparent economic data.
          </p>
          <Link
            href="/market-price-index"
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-lg hover:shadow-blue-300/50 transition-transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
          >
            <TrendingUp className="w-5 h-5" />
            Explore Dashboard
          </Link>
        </article>

        {/* RIGHT CONTENT */}
        <aside className="z-20 md:w-1/2 w-full flex flex-col justify-center items-center gap-5">
          {/* FX Rates Card */}
          <motion.section
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="backdrop-blur-lg shadow-xl border border-blue-100 rounded-2xl p-4 flex flex-col items-center w-full sm:w-80 bg-white/90"
          >
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center text-red-600"
                >
                  <AlertTriangle className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              ) : rates ? (
                <motion.div
                  key={currentCurrency}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center w-full"
                >
                  <header className="flex items-center gap-2 mb-2">
                    {currencyIcons[currentCurrency]}
                    <h2 className="text-base font-semibold text-gray-800">
                      1 {currentCurrency} ({flags[currentCurrency]}) = PHP
                    </h2>
                  </header>
                  <p className="text-gray-900 font-extrabold text-3xl">
                    &#8369;{rates[currentCurrency]?.toFixed(2) ?? "—"}
                  </p>
                  {lastUpdated && (
                    <p className="text-gray-500 text-xs mt-1">
                      Updated {lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.p
                  key="loading"
                  className="text-gray-500 text-sm mt-2 animate-pulse"
                >
                  Loading exchange rates...
                </motion.p>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Currency Info */}
          <section className="backdrop-blur-sm shadow-md border border-blue-100 rounded-xl p-4 flex flex-col gap-3 w-full sm:w-80 text-sm sm:text-base bg-white/80">
            <header className="text-center mb-1">
              <h3 className="text-gray-700 font-semibold">Currency Overview</h3>
            </header>
            <ul className="flex flex-col gap-2">
              <li className="flex justify-between">
                <p className="flex items-center gap-1 text-gray-700">
                  <DollarSign className="w-4 h-4 text-blue-500" /> Major Currencies
                </p>
                <p className="font-semibold">{displayCurrencies.join(", ")}</p>
              </li>
              <li className="flex justify-between">
                <p className="flex items-center gap-1 text-gray-700">
                  <Clock className="w-4 h-4 text-blue-500" /> Updates
                </p>
                <p className="font-semibold">Every 15 Minutes</p>
              </li>
              <li className="flex justify-between">
                <p className="flex items-center gap-1 text-gray-700">
                  <Activity className="w-4 h-4 text-blue-500" /> Base
                </p>
                <p className="font-semibold">Philippine Peso &#40;PHP&#41;</p>
              </li>
            </ul>
          </section>
        </aside>
      </main>
    </section>
  );
};
