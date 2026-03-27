/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Search, ChevronDown, Loader2 } from "lucide-react";

export default function SearchBox({
  filters,
  handleFilterChange,
  handleSearch,
  isLoading,
  assets,
  assetsLoading,
  locations,
}: any) {
  const [open, setOpen] = useState(false);

  const summary = `${filters.serviceType || "Service"}, ${
    filters.location || "Location"
  }, ${filters.mediaType || "Media"}`;

  return (
    <>
      {/* ---------------- DESKTOP ---------------- */}
      <div className="hidden md:block mt-12 bg-white rounded-2xl shadow-lg p-6 w-full">
        <div className="grid grid-cols-4 gap-4">
          {/* Selects */}
          {[
            {
              label: "Service Type",
              value: filters.serviceType,
              key: "serviceType",
              options: assets.services,
            },
            {
              label: "Location",
              value: filters.location,
              key: "location",
              options: locations,
            },
            {
              label: "Media Type",
              value: filters.mediaType,
              key: "mediaType",
              options: assets.mediaType,
            },
          ].map((item) => (
            <div key={item.key}>
              <label className="text-sm text-gray-600 mb-2 block">
                {item.label}
              </label>
              <select
                value={item.value}
                onChange={(e) =>
                  handleFilterChange(item.key, e.target.value)
                }
                className="w-full px-3 py-3 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-[#0088b5]"
              >
                {assetsLoading ? (
                  <option>Loading...</option>
                ) : (
                  item.options.map((opt: string) => (
                    <option key={opt}>{opt}</option>
                  ))
                )}
              </select>
            </div>
          ))}

          {/* Button */}
          <button
            onClick={() => handleSearch(1)}
            className="bg-[#0088b5] text-white rounded-xl flex items-center justify-center gap-2 font-semibold hover:scale-[1.02] transition"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Search size={18} /> Search
              </>
            )}
          </button>
        </div>
      </div>

      {/* ---------------- MOBILE ---------------- */}

      {/* COLLAPSED BAR */}
      <div className="md:hidden mt-6">
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-white rounded-2xl shadow-md px-4 py-4 flex items-center justify-between"
        >
          <div className="text-left">
            <p className="text-sm text-gray-400">Search Ads</p>
            <p className="text-sm font-medium text-gray-800 truncate">
              {summary}
            </p>
          </div>

          <ChevronDown className="text-gray-400" />
        </button>
      </div>

      {/* FULLSCREEN MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 space-y-6 animate-[slideUp_.3s_ease]">

            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Search Filters</h2>
              <button onClick={() => setOpen(false)}>Close</button>
            </div>

            {/* Fields */}
            {[
              {
                label: "Service Type",
                value: filters.serviceType,
                key: "serviceType",
                options: assets.services,
              },
              {
                label: "Location",
                value: filters.location,
                key: "location",
                options: locations,
              },
              {
                label: "Media Type",
                value: filters.mediaType,
                key: "mediaType",
                options: assets.mediaType,
              },
            ].map((item) => (
              <div key={item.key}>
                <label className="text-sm text-gray-600 mb-2 block">
                  {item.label}
                </label>
                <select
                  value={item.value}
                  onChange={(e) =>
                    handleFilterChange(item.key, e.target.value)
                  }
                  className="w-full px-4 py-4 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-[#0088b5]"
                >
                  {assetsLoading ? (
                    <option>Loading...</option>
                  ) : (
                    item.options.map((opt: string) => (
                      <option key={opt}>{opt}</option>
                    ))
                  )}
                </select>
              </div>
            ))}

            {/* CTA */}
            <button
              onClick={() => {
                handleSearch(1);
                setOpen(false);
              }}
              className="w-full bg-[#0088b5] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Search size={18} /> Search
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}