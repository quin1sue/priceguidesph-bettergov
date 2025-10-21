import React from "react";

export const TableSkeleton = () => {
  return (
    <div className="w-full h-[calc(100vh-7.5em)] bg-gray-100 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-40 bg-gray-300 rounded"></div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-gray-300 rounded"></div>
          <div className="h-8 w-20 bg-gray-300 rounded"></div>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 bg-gray-200 py-3 px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 rounded w-3/4"></div>
          ))}
        </div>

        <div className="divide-y divide-gray-200">
          {[...Array(8)].map((_, row) => (
            <div
              key={row}
              className="grid grid-cols-6 py-4 px-4 bg-gray-100 hover:bg-gray-50 transition"
            >
              {[...Array(6)].map((_, col) => (
                <div key={col} className="h-4 bg-gray-300 rounded w-5/6"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
