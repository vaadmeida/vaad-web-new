/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import BillboardFullCard from "../components/billboard/BillboardFullCard";
import FilterSidebar from "../components/billboard/FilterSidebar";
import SearchBox from "../components/SearchBox";
import { useAssets } from "../hooks/useAssets";
import { Billboard } from "../types/billboard";
import Image from "next/image";
import Navbar from "../components/layout/Navbar";
import Link from "next/link";
import Footer from "../components/Home/Footer";
import SimilarMedia from "../components/SimilarMedia";
import ResultsFilterBar from "../components/ResultsFilterBar";
import { useCartDrawer } from "../hooks/useCartDrawer";

type Filters = {
  mediaType: string;
  productType: string;
  location: string;
};

// Dummy Data (kept your structure)
// ✅ Dummy Data - Matches your Billboard type exactly
const dummyBillboards: Billboard[] = [
  {
    id: "1",
    title: "Backlit Billboard at Major Roundabout",
    location: "Ikeja, Lagos",
    price: "₦450,000 / month",
    image:
      "https://images.squarespace-cdn.com/content/v1/5dee6587e159e73b7ff7d7cc/2cc7e6ae-6fdc-4b57-aa8e-18523b839ff0/Example+of+an+Effective+Billboard+Design",
    size: "12m x 5m",
    impressions: "120k daily",
  },
  {
    id: "2",
    title: "LED Billboard at Lekki Expressway",
    location: "Lekki, Lagos",
    price: "₦900,000 / month",
    image:
      "https://images.squarespace-cdn.com/content/v1/5dee6587e159e73b7ff7d7cc/2cc7e6ae-6fdc-4b57-aa8e-18523b839ff0/Example+of+an+Effective+Billboard+Design",
    size: "10m x 4m",
    impressions: "200k daily",
  },
  {
    id: "3",
    title: "Gantry Billboard at Victoria Island",
    location: "Victoria Island, Lagos",
    price: "₦1,200,000 / month",
    image:
      "https://images.squarespace-cdn.com/content/v1/5dee6587e159e73b7ff7d7cc/2cc7e6ae-6fdc-4b57-aa8e-18523b839ff0/Example+of+an+Effective+Billboard+Design",
    size: "14m x 6m",
    impressions: "300k daily",
  },
  {
    id: "4",
    title: "Unipole Billboard at Ikorodu Toll Gate",
    location: "Ikorodu, Lagos",
    price: "₦350,000 / month",
    image:
      "https://images.squarespace-cdn.com/content/v1/5dee6587e159e73b7ff7d7cc/2cc7e6ae-6fdc-4b57-aa8e-18523b839ff0/Example+of+an+Effective+Billboard+Design",
    size: "8m x 3m",
    impressions: "90k daily",
  },
  {
    id: "5",
    title: "Static Billboard at Yaba Bus Stop",
    location: "Yaba, Lagos",
    price: "₦250,000 / month",
    image:
      "https://images.squarespace-cdn.com/content/v1/5dee6587e159e73b7ff7d7cc/2cc7e6ae-6fdc-4b57-aa8e-18523b839ff0/Example+of+an+Effective+Billboard+Design",
    size: "6m x 3m",
    impressions: "60k daily",
  },
  {
    id: "6",
    title: "Rooftop Billboard at Surulere Mall",
    location: "Surulere, Lagos",
    price: "₦700,000 / month",
    image:
      "https://images.squarespace-cdn.com/content/v1/5dee6587e159e73b7ff7d7cc/2cc7e6ae-6fdc-4b57-aa8e-18523b839ff0/Example+of+an+Effective+Billboard+Design",
    size: "10m x 4m",
    impressions: "150k daily",
  },
];

export default function BillboardPage() {
  const [mounted, setMounted] = useState(false);
  const { assets, locations, isLoading: assetsLoading } = useAssets();
  const [activeFilter, setActiveFilter] = useState("Non-illuminated");
  const { open, openCart, closeCart } = useCartDrawer();

  const [filters, setFilters] = useState<Filters>({
    mediaType: "",
    productType: "",
    location: "",
  });

  const [results, setResults] = useState<Billboard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  });

  // Fix hydration - set mounted on client only
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize filters from assets
  useEffect(() => {
    if (!assetsLoading && assets.mediaAndProductsTypes && mounted) {
      const mediaTypes = Object.keys(assets.mediaAndProductsTypes);
      if (mediaTypes.length > 0 && !filters.mediaType) {
        const firstMediaType = mediaTypes[0];
        const productTypes = assets.mediaAndProductsTypes[firstMediaType] || [];

        setFilters({
          mediaType: firstMediaType,
          productType: productTypes[0] || "",
          location: locations[0] || "",
        });
      }
    }
  }, [assets, assetsLoading, locations, mounted, filters.mediaType]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filterBillboards = useCallback(
    (billboards: Billboard[]) => {
      let filtered = [...billboards];

      if (filters.location) {
        filtered = filtered.filter((b) =>
          b.location?.toLowerCase().includes(filters.location.toLowerCase()),
        );
      }

      return filtered;
    },
    [filters.location],
  );

  const handleSearch = useCallback(
    async (page: number = 1) => {
      if (!mounted) return;

      setIsLoading(true);
      setHasSearched(true);

      await new Promise((res) => setTimeout(res, 300)); // simulate delay

      const filtered = filterBillboards(dummyBillboards);
      const start = (page - 1) * pagination.limit;
      const end = start + pagination.limit;
      const paginatedResults = filtered.slice(start, end);

      setResults(paginatedResults);
      setPagination({
        page,
        limit: pagination.limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / pagination.limit),
      });

      setIsLoading(false);
    },
    [mounted, pagination.limit, filterBillboards],
  );

  // Auto search when mounted or filters change
  useEffect(() => {
    if (mounted && !assetsLoading) {
      handleSearch(1);
    }
  }, [mounted, assetsLoading, filters.location, handleSearch]);

  const handlePageChange = (page: number) => {
    handleSearch(page);
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  // Prevent hydration mismatch - show nothing until client is ready
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F7F9FC]">
        <Navbar transparent />
        <div className="h-96 bg-gray-200 animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#F7F9FC] min-h-screen">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar transparent />
        </div>

        {/* CLEAN HEADER (NO IMAGE) */}
        <section className="relative w-full bg-linear-to-r from-[#0177AB] to-[#003045] pt-24 pb-20 px-18">
          {/* FLOATING SEARCH */}
          <div className="relative z-20 -mb-38">
            <SearchBox
              filters={filters}
              handleFilterChange={handleFilterChange}
              handleSearch={() => handleSearch(1)}
              isLoading={isLoading}
              assets={assets}
              assetsLoading={assetsLoading}
              locations={locations}
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="pb-12 pt-32 bg-white px-4 sm:px-6 lg:px-18">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-12 md:col-span-3">
              <FilterSidebar />
            </div>

            {/* Results Area */}
            <div className="col-span-12 md:col-span-9">
              <ResultsFilterBar
                title="Static Billboard"
                total={pagination.total}
                filters={[
                  "Non-illuminated",
                  "Available Now",
                  "Residence",
                  "₦ 200,000 - ₦ 500,000",
                ]}
                activeFilter={activeFilter}
                onFilterChange={(value) => setActiveFilter(value)}
                openCart={openCart}
                open={open}
                closeCart={closeCart}
              />

              {/* Loading Skeletons */}
              {isLoading && (
                <div className="space-y-6">
                  {Array.from({ length: pagination.limit }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[180px] bg-gray-200 animate-pulse rounded-2xl"
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && hasSearched && results.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">
                    No billboards found matching your criteria.
                  </p>
                  <button
                    onClick={() => {
                      setFilters({
                        mediaType: "",
                        productType: "",
                        location: "",
                      });
                      handleSearch(1);
                    }}
                    className="mt-6 text-[#0088b5] hover:underline font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Results - Fixed Rendering */}
              {!isLoading && results.length > 0 && (
                <div className="space-y-6">
                  {results.map((board) => (
                    <BillboardFullCard key={board.id} billboard={board} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!isLoading && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-10 gap-2 flex-wrap">
                  {/* Your pagination buttons remain the same */}
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 rounded-lg text-sm border bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {/* ... rest of your pagination logic ... */}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 rounded-lg text-sm border bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <SimilarMedia />
      <Footer />
    </>
  );
}
