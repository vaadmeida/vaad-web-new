"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
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

export default function Hero() {
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

  // Initialize filters when assets load
  useEffect(() => {
    if (!assetsLoading && assets.mediaAndProductsTypes) {
      const mediaTypes = Object.keys(assets.mediaAndProductsTypes);

      if (mediaTypes.length > 0 && !filters.mediaType) {
        const firstMediaType = mediaTypes[0];
        const productTypesForMedia = assets.mediaAndProductsTypes[firstMediaType] || [];

        setFilters({
          mediaType: firstMediaType,
          productType: productTypesForMedia[0] || "",
          location: locations[0] || "",
        });
      }
    }
  }, [assets, assetsLoading, locations]);

  // Handle hydration - only run after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = useCallback(
    async (page: number = 1) => {
      if (!isMounted) return;

      setIsLoading(true);
      setHasSearched(true);

      const searchParams: SearchParams = {
        mediaType: filters.mediaType,
        serviceType: filters.productType,
        location: filters.location,
        limit: pagination.limit,
        page: page,
      };

      try {
        const response = await billboardService.searchBillboards(searchParams);

        const fetchedResults = response.foundItems || [];
        setResults(fetchedResults);

        const totalCount = response?.count || 0;
        const totalPagesValue =
          response.totalPages || Math.ceil(totalCount / pagination.limit);

        setPagination({
          page: page,
          limit: pagination.limit,
          total: totalCount,
          totalPages: totalPagesValue,
        });
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
        setPagination({
          page: 1,
          limit: pagination.limit,
          total: 0,
          totalPages: 0,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [filters, isMounted, pagination.limit],
  );

  // Auto-search on mount (client-side only)
  useEffect(() => {
    if (
      isMounted &&
      !assetsLoading &&
      filters.mediaType &&
      filters.productType
    ) {
      handleSearch(1);
    }
  }, [
    isMounted,
    handleSearch,
    assetsLoading,
    filters.mediaType,
    filters.productType,
  ]);

  const handlePageChange = (newPage: number) => {
    handleSearch(newPage);
    window.scrollTo({ top: 600, behavior: "smooth" });
  };

  // Prevent hydration mismatch - render minimal UI on server
  if (!isMounted) {
    return (
      <div className="relative w-full min-h-screen bg-white">
        <div className="relative min-h-screen flex flex-col">
          <div className="absolute inset-0 h-screen">
            <Image
              src="/video/vaad-bg.gif"
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
    <div className="relative w-full sm:min-h-screen bg-white">
      <div className="relative sm:min-h-screen flex flex-col">
        {/* Background GIF */}
        <div className="absolute inset-0 sm:h-screen">
          <Image
            src="/video/vaad-bg.gif"
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