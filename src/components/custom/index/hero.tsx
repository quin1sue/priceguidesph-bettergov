"use client";
import { JSX, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Euro,
  CreditCard,
  Activity,
  Zap,
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

  //fetch exchange rates
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
        console.error("Error:", err);
      }
    };

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayCurrencies.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentCurrency = displayCurrencies[currentIndex];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 mt-[20px] h-[80vh] px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_60%)]"></div>

      {/* LEFT CONTENT */}
      <article className="relative max-md:flex-col max-md:items-center max-md:justify-center z-10 md:w-1/2 text-center md:text-left space-y-5">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
          Track Essential Data <br /> with{" "}
          <span className="text-blue-600">Transparency</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-md mx-auto md:mx-0">
          Ekonotrack provides real-time updates on key economic indicators such
          as exchange rates, fuel prices, and market trends — empowering you
          with data that matters.
        </p>
        <Link
          href={"/dashboard"}
          className="mt-6 px-6 py-3 bg-blue-600 w-[15em] hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition duration-300 flex items-center gap-2"
        >
          <TrendingUp className="w-5 h-5" />
          Explore Dashboard
        </Link>
      </article>
      <aside className="relative z-10 md:w-1/2 flex flex-col gap-6">
        <section className="bg-white/80 backdrop-blur-md shadow-lg border border-blue-100 rounded-2xl p-6 flex flex-col items-center transition-all">
          <AnimatePresence mode="wait">
            {rates && (
              <motion.article
                key={currentCurrency}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center w-full"
              >
                <header className="flex items-center gap-2 mb-3">
                  {currencyIcons[currentCurrency]}
                  <h2 className="text-lg font-semibold text-gray-800 text-center">
                    1 {currentCurrency} = PHP
                  </h2>
                </header>
                <p className="text-gray-900 font-bold text-2xl">
                  &#8369;{rates[currentCurrency]?.toFixed(2) ?? "—"}
                </p>
              </motion.article>
            )}
          </AnimatePresence>
          {!rates && (
            <p className="text-gray-500 text-sm mt-2">Loading rates...</p>
          )}
        </section>
        <section className="bg-white/80 backdrop-blur-md shadow-lg border border-blue-100 rounded-2xl p-5 flex flex-col gap-4">
          <header className="text-center">
            <h3 className="text-gray-700 font-semibold">Currency Info</h3>
          </header>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <DollarSign className="w-5 h-5 text-blue-500" /> Major
                Currencies
              </span>
              <span className="text-gray-900 font-bold">
                {displayCurrencies.join(", ")}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <Clock className="w-5 h-5 text-blue-500" /> Updated Every
              </span>
              <span className="text-gray-900 font-bold">Minute</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <Activity className="w-5 h-5 text-blue-500" /> PHP Base
              </span>
              <span className="text-gray-900 font-bold">Philippine Peso</span>
            </li>
          </ul>
        </section>
      </aside>
    </section>
  );
};
