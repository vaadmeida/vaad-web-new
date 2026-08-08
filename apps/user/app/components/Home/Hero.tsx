/* eslint-disable react-hooks/set-state-in-effect */
// app/components/sections/Hero.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Billboard,
  billboardService,
  SearchParams,
} from "@/app/lib/billboard/billboard-service";
import { useAssets } from "@/app/hooks/useAssets";
import SearchBox from "../SearchBox";

interface Filters {
  mediaType: string;
  productType: string;
  location: string;
}

// Helper to format URL parameters
const formatUrlParam = (text: string) => {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-');
};

export default function Hero() {
  const router = useRouter();
  const { assets, locations, isLoading: assetsLoading } = useAssets();

  const [filters, setFilters] = useState<Filters>({
    mediaType: "",
    productType: "",
    location: "",
  });

  const [results, setResults] = useState<Billboard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  });
  
  // Use ref to track if initial filters have been set
  const filtersInitializedRef = useRef(false);

  // Initialize filters when assets load - using ref to avoid cascade
  useEffect(() => {
    if (!assetsLoading && assets.mediaAndProductsTypes && !filtersInitializedRef.current) {
      const mediaTypes = Object.keys(assets.mediaAndProductsTypes);

      if (mediaTypes.length > 0 && !filters.mediaType) {
        filtersInitializedRef.current = true;
        const firstMediaType = mediaTypes[0];
        const productTypesForMedia = assets.mediaAndProductsTypes[firstMediaType] || [];

        setFilters({
          mediaType: firstMediaType,
          productType: productTypesForMedia[0] || "",
          location: locations[0] || "",
        });
      }
    }
  }, [assets, assetsLoading, locations, filters.mediaType]);

  // Handle hydration - only run after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = useCallback(async () => {
    if (!isMounted) return;

    // Build the URL with filters
    const mediaTypeParam = formatUrlParam(filters.mediaType || "all");
    const stateParam = formatUrlParam(filters.location || "all");
    
    // Redirect to advertise page with the search parameters in URL
    router.push(`/advertise/${mediaTypeParam}/in/nigeria/${stateParam}`);
    
  }, [filters, isMounted, router]);

  // Prevent hydration mismatch - render minimal UI on server
  if (!isMounted) {
    return (
      <div className="relative w-full min-h-screen bg-white">
        <div className="relative min-h-screen flex flex-col">
          <div className="absolute inset-0 h-screen">
            <Image
              // src="/video/vaad-bg.gif"
              src="/images/vaad-home.jpg"
              alt="VAAD Media Billboard"
              fill
              priority
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-10 pt-24 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-18">
              <div className="max-w-3xl">
                <h1 className="text-white text-[2vw] sm:text-6xl font-bold leading-tight suez-one">
                  Find It, Book It,
                  <br />
                  Go Live!
                </h1>
                <p className="text-[#FAF5ED] sm:text-lg text-[3vw] mt-4 max-w-xl font-normal">
                  We connect brands to millions through high-impact billboards
                  across Nigeria
                </p>
              </div>
              <div className="mt-12 bg-white rounded-lg shadow-xl p-6 max-w-5xl h-32 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-white">
      <div className="relative flex flex-col sm:pb-16 pb-0">
        {/* Background GIF */}
        <div className="absolute inset-0">
          <Image
             // src="/video/vaad-bg.gif"
              src="/images/vaad-home.jpg"
            alt="VAAD Media Billboard"
            fill
            priority
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 pt-24 sm:pb-16 pb-24">
          <div className="container mx-auto px-5 lg:px-18">
            <div className="sm:max-w-3xl">
              <h1 className="text-white text-[11vw] sm:text-6xl font-bold leading-tight suez-one">
                Find It, Book It,
                <br />
                Go Live!
              </h1>
              <p className="text-[#FAF5ED] sm:text-lg text-[4vw] mt-4 max-w-xl font-normal">
                We connect brands to millions through high-impact billboards
                across Nigeria
              </p>
            </div>

            {/* Search Box */}
            <SearchBox
              filters={filters}
              handleFilterChange={handleFilterChange}
              handleSearch={handleSearch}
              isLoading={isLoading}
              assets={assets}
              assetsLoading={assetsLoading}
              locations={locations}
            />
          </div>
        </div>
      </div>
    </div>
  );
}