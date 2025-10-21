"use client";

import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

type DashboardErrorProps = {
  message?: string;
};

export const DashboardError = ({ message }: DashboardErrorProps) => {
  return (
    <main className="flex flex-col items-center justify-center w-full h-[calc(100vh-7.5em)] p-6 text-center">
      <section className="flex items-center justify-center mb-4 text-red-600">
        <FaExclamationTriangle className="text-4xl mr-2" />
        <h2 className="text-2xl font-semibold">Error Occurred</h2>
      </section>
      <p className="text-gray-700 text-sm max-w-md">
        {message
          ? message
          : "Something went wrong while loading the data. Please try again later."}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Retry
      </button>
    </main>
  );
};


