/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, Loader2 } from "lucide-react";

interface Filters {
  mediaType: string;
  productType: string;
  location: string;
}

interface AssetsData {
  mediaTypeData: Record<string, string[]>;
  statesAndCites: Record<string, string[]>;
}

interface SearchBoxProps {
  filters: Filters;
  handleFilterChange: (key: keyof Filters, value: string) => void;
  handleSearch: (page?: number) => void;
  isLoading: boolean;
  assets: AssetsData;
  assetsLoading: boolean;
  locations: string[];
}

export default function SearchBox({
  filters,
  handleFilterChange,
  handleSearch,
  isLoading,
  assets,
  assetsLoading,
  locations,
}: SearchBoxProps) {
  const [open, setOpen] = useState(false);

  // Get available media types from the new structure
  const mediaTypes = useMemo(() => {
    return Object.keys(assets?.mediaTypeData || {});
  }, [assets]);

  // Get available product types based on selected media type
  const availableProductTypes = useMemo(() => {
    if (!filters.mediaType || !assets?.mediaTypeData) return [];
    return assets.mediaTypeData[filters.mediaType] || [];
  }, [filters.mediaType, assets]);

  // Handle media type change - also updates product type to first available
  const handleMediaTypeChange = (value: string) => {
    handleFilterChange("mediaType", value);
    // Product type will be updated by the parent component's useEffect
    // But we can also set it here for immediate feedback
    const productTypes = assets?.mediaTypeData?.[value] || [];
    if (productTypes.length > 0) {
      handleFilterChange("productType", productTypes[0]);
    }
  };

  // Summary text for mobile collapsed view
  const summary = `${filters.mediaType || "Media"}, ${
    filters.productType || "Product"
  }, ${filters.location || "Location"}`;

  // Desktop field configuration - reordered: Media Type, Product Type, Location
  const desktopFields = [
    {
      label: "Media Type",
      value: filters.mediaType,
      key: "mediaType" as const,
      options: mediaTypes,
      onChange: handleMediaTypeChange,
    },
    {
      label: "Product Type",
      value: filters.productType,
      key: "productType" as const,
      options: availableProductTypes,
      onChange: (value: string) => handleFilterChange("productType", value),
      disabled: !filters.mediaType || availableProductTypes.length === 0,
    },
    {
      label: "Location",
      value: filters.location,
      key: "location" as const,
      options: locations,
      onChange: (value: string) => handleFilterChange("location", value),
    },
  ];

  // Mobile field configuration - same order
  const mobileFields = [
    {
      label: "Media Type",
      value: filters.mediaType,
      key: "mediaType" as const,
      options: mediaTypes,
      onChange: handleMediaTypeChange,
    },
    {
      label: "Product Type",
      value: filters.productType,
      key: "productType" as const,
      options: availableProductTypes,
      onChange: (value: string) => handleFilterChange("productType", value),
      disabled: !filters.mediaType || availableProductTypes.length === 0,
    },
    {
      label: "Location",
      value: filters.location,
      key: "location" as const,
      options: locations,
      onChange: (value: string) => handleFilterChange("location", value),
    },
  ];

  return (
    <>
      {/* ---------------- DESKTOP ---------------- */}
      <div className="hidden md:block mt-12 bg-white rounded-2xl shadow-lg p-6 w-full">
        <div className="grid grid-cols-4 gap-4">
          {/* Selects - Reordered: Media Type, Product Type, Location */}
          {desktopFields.map((item) => (
            <div key={item.key}>
              <label className="text-sm text-gray-600 mb-2 block">
                {item.label}
              </label>
              <select
                value={item.value}
                onChange={(e) => item.onChange(e.target.value)}
                disabled={assetsLoading || item.disabled}
                className="w-full px-3 py-3 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-[#0088b5] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assetsLoading ? (
                  <option>Loading...</option>
                ) : item.options.length === 0 ? (
                  <option>No options</option>
                ) : (
                  item.options.map((opt: string) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))
                )}
              </select>
            </div>
          ))}

          {/* Button */}
          <button
            onClick={() => handleSearch(1)}
            disabled={isLoading}
            className="bg-[#0088b5] text-white rounded-xl flex items-center justify-center gap-2 font-semibold hover:scale-[1.02] transition disabled:opacity-60"
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

            {/* Fields - Reordered: Media Type, Product Type, Location */}
            {mobileFields.map((item) => (
              <div key={item.key}>
                <label className="text-sm text-gray-600 mb-2 block">
                  {item.label}
                </label>
                <select
                  value={item.value}
                  onChange={(e) => item.onChange(e.target.value)}
                  disabled={assetsLoading || item.disabled}
                  className="w-full px-4 py-4 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-[#0088b5] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {assetsLoading ? (
                    <option>Loading...</option>
                  ) : item.options.length === 0 ? (
                    <option>No options</option>
                  ) : (
                    item.options.map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
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
              disabled={isLoading}
              className="w-full bg-[#0088b5] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
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