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
} from "lucide-react";
import Link from "next/link";

export const HeroIndex = () => {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayCurrencies = ["USD", "EUR", "JPY", "SAR"];
  const currencyIcons: Record<string, JSX.Element> = {
    USD: <DollarSign className="w-5 h-5 text-blue-500" />,
    EUR: <Euro className="w-5 h-5 text-blue-500" />,
    JPY: <Activity className="w-5 h-5 text-blue-500" />,
    SAR: <CreditCard className="w-5 h-5 text-blue-500" />,
  };

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          `https://api.fxratesapi.com/latest?api_key=${process.env.NEXT_PUBLIC_FXRATES_API_KEY}&base=PHP&format=json&places=2&amount=1`
        );
        if (!response.ok) throw new Error("Failed to fetch exchange rates");

        const result = await response.json();
        const invertedRates: Record<string, number> = {};
        for (const [currency, rate] of Object.entries(result.rates)) {
          invertedRates[currency] = 1 / (rate as number);
        }
        setRates(invertedRates);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayCurrencies.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentCurrency = displayCurrencies[currentIndex];

  return (
    <section className="relative mt-[5em] w-full px-4 sm:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
      {/* background accent color */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1),transparent_60%)]" />

      {/* LEFT CONTENT */}
      <article className="relative z-10 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
          Track Essential Data <br />
          <span className="text-blue-600">with Transparency</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-md">
          Real-time updates on key economic indicators such as exchange rates,
          fuel prices, and market trends — empowering you with essential data.
        </p>
        <Link
          href="/dashboard"
          className="mt-2 px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-sm flex items-center gap-2 text-sm sm:text-base"
        >
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          Explore Dashboard
        </Link>
      </article>

      {/* RIGHT CONTENT */}
      <aside className="relative z-10 w-full md:w-1/2 flex flex-col justify-center items-center gap-4">
        {/* Animated current rate */}
        <section className="bg-white/90 backdrop-blur-md shadow-md border border-blue-100 rounded-xl p-4 flex flex-col items-center transition-all hover:scale-[1.01] duration-200 w-full sm:w-80">
          <AnimatePresence mode="wait">
            {rates && (
              <motion.div
                key={currentCurrency}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center w-full"
              >
                <header className="flex items-center gap-2 mb-2">
                  {currencyIcons[currentCurrency]}
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800 text-center">
                    1 {currentCurrency} = PHP
                  </h2>
                </header>
                <p className="text-gray-900 font-bold text-xl sm:text-2xl">
                  &#8369;{rates[currentCurrency]?.toFixed(2) ?? "—"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {!rates && (
            <p className="text-gray-500 text-sm mt-1">Loading rates...</p>
          )}
        </section>

        {/* Currency Info */}
        <section className="bg-white/90 backdrop-blur-md shadow-md border border-blue-100 rounded-xl py-3 px-4 flex flex-col gap-2 w-full sm:w-80 text-sm sm:text-base">
          <header className="text-center">
            <h3 className="text-gray-700 font-semibold">Currency Info</h3>
          </header>
          <ul className="flex flex-col gap-1">
            <li className="flex justify-between">
              <span className="flex items-center gap-1 font-medium text-gray-700">
                <DollarSign className="w-4 h-4 text-blue-500" /> Major
                Currencies
              </span>
              <span className="text-gray-900 font-semibold">
                {displayCurrencies.join(", ")}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="flex items-center gap-1 font-medium text-gray-700">
                <Clock className="w-4 h-4 text-blue-500" /> Updated Every
              </span>
              <span className="text-gray-900 font-semibold">Minute</span>
            </li>
            <li className="flex justify-between">
              <span className="flex items-center gap-1 font-medium text-gray-700">
                <Activity className="w-4 h-4 text-blue-500" /> PHP Base
              </span>
              <span className="text-gray-900 font-semibold">
                Philippine Peso
              </span>
            </li>
          </ul>
        </section>
      </aside>
    </section>
  );
};
