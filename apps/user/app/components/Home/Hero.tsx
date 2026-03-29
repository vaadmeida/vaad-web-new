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
  serviceType: string;
  location: string;
  mediaType: string;
}

export default function Hero() {
  const { assets, locations, isLoading: assetsLoading } = useAssets();

  const [filters, setFilters] = useState<Filters>({
    serviceType: "Outdoor Advertising",
    location: "Lagos",
    mediaType: "Led Billboard",
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

  // Update filters when assets are loaded
  useEffect(() => {
    if (assets.services.length > 0 && !filters.serviceType) {
      setFilters((prev) => ({ ...prev, serviceType: assets.services[0] }));
    }
    if (assets.mediaType.length > 0 && !filters.mediaType) {
      setFilters((prev) => ({ ...prev, mediaType: assets.mediaType[0] }));
    }
    if (locations.length > 0 && !filters.location) {
      setFilters((prev) => ({ ...prev, location: locations[0] }));
    }
  }, [assets, locations]);

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
        serviceType: filters.serviceType,
        location: filters.location,
        mediaType: filters.mediaType,
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
    if (isMounted && !assetsLoading) {
      handleSearch(1);
    }
  }, [isMounted, handleSearch, assetsLoading]);

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

        {/* Search Results Section */}
        {/* <div className="relative z-10 bg-gray-50 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-18">
            {hasSearched && (
              <>
                {/* Results Header 
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {isLoading
                        ? "Searching..."
                        : `${pagination.total} Billboard${pagination.total !== 1 ? "s" : ""} Found`}
                    </h2>
                    {!isLoading && results.length > 0 && (
                      <p className="text-gray-500 text-sm mt-1">
                        Showing {results.length} of {pagination.total} results
                      </p>
                    )}
                  </div>

                  {!isLoading && results.length > 0 && (
                    <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0088b5]">
                      <option>Sort by: Relevance</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Rating: High to Low</option>
                      <option>Most Viewed</option>
                    </select>
                  )}
                </div>

                {/* Results Grid *
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0088b5]"></div>
                  </div>
                ) : results.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.map((billboard) => (
                        <BillboardCard
                          key={billboard._id}
                          billboard={billboard}
                          onBookmark={() => {
                            console.log("Bookmark:", billboard._id);
                          }}
                        />
                      ))}
                    </div>

                    {/* Pagination *
                    {pagination.totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-10">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>

                        <div className="flex gap-1">
                          {Array.from(
                            { length: Math.min(5, pagination.totalPages) },
                            (_, i) => {
                              let pageNum;
                              if (pagination.totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (pagination.page <= 3) {
                                pageNum = i + 1;
                              } else if (
                                pagination.page >=
                                pagination.totalPages - 2
                              ) {
                                pageNum = pagination.totalPages - 4 + i;
                              } else {
                                pageNum = pagination.page - 2 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => handlePageChange(pageNum)}
                                  className={`w-10 h-10 rounded-lg transition-colors ${
                                    pagination.page === pageNum
                                      ? "bg-[#0088b5] text-white"
                                      : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}
                        </div>

                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No billboards found
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      We couldn&apos;t find any billboards matching your
                      criteria. Try adjusting your search filters or explore
                      other locations.
                    </p>
                    <button
                      onClick={() => {
                        setFilters({
                          serviceType: assets.services[0] || "Outdoor Advertising",
                          location: locations[0] || "Lagos",
                          mediaType: assets.mediaType[0] || "Led Billboard",
                        });
                        handleSearch(1);
                      }}
                      className="mt-6 px-6 py-2 bg-[#0088b5] text-white rounded-lg hover:bg-[#006d91] transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
