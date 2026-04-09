// app/advertise/[mediaType]/in/[country]/[state]/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import BillboardFullCard from "@/app/components/billboard/BillboardFullCard";
import FilterSidebar from "@/app/components/billboard/FilterSidebar";
import SearchBox from "@/app/components/SearchBox";
import { useAssets } from "@/app/hooks/useAssets";
import { Billboard } from "@/app/types/billboard";
import Navbar from "@/app/components/layout/Navbar";
import Link from "next/link";
import Footer from "@/app/components/Home/Footer";
import SimilarMedia from "@/app/components/SimilarMedia";
import ResultsFilterBar from "@/app/components/ResultsFilterBar";
import { useCartDrawer } from "@/app/hooks/useCartDrawer";
import { billboardService } from "@/app/lib/billboard/billboard-service";

type Filters = {
  mediaType: string;
  productType: string;
  location: string;
  serviceType?: string;
  minRate?: number;
  maxRate?: number;
};

// Helper to format URL parameters
const formatUrlParam = (text: string) => {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-');
};

const formatDisplayText = (text: string) => {
  return text.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function BillboardListingPage() {
  const params = useParams();
  const router = useRouter();
  const { mediaType, country, state } = params;
  
  const [mounted, setMounted] = useState(false);
  const { assets, isLoading: assetsLoading, getCitiesForState } = useAssets();
  const [activeFilter, setActiveFilter] = useState("Non-illuminated");
  const { open, openCart, closeCart } = useCartDrawer();

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState<Filters>({
    mediaType: formatDisplayText(mediaType as string),
    productType: "",
    location: formatDisplayText(state as string),
    serviceType: "",
    minRate: undefined,
    maxRate: undefined,
  });

  const [results, setResults] = useState<Billboard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  });

  // Use ref to track initial search
  const initialSearchDoneRef = useRef(false);

  // Fix hydration - set mounted on client only
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update URL when filters change
  const updateUrl = useCallback((newFilters: Filters) => {
    const mediaTypeParam = formatUrlParam(newFilters.mediaType || "all");
    const stateParam = formatUrlParam(newFilters.location || "all");
    
    router.push(`/advertise/${mediaTypeParam}/in/nigeria/${stateParam}`);
  }, [router]);

  // Update cities when location (state) changes
  useEffect(() => {
    if (filters.location && assets.statesAndCites) {
      const cities = getCitiesForState(filters.location);
      setAvailableCities(cities);
    } else {
      setAvailableCities([]);
    }
  }, [filters.location, assets.statesAndCites, getCitiesForState]);

  const handleSearch = useCallback(
    async (page: number = 1) => {
      if (!mounted) return;

      setIsLoading(true);
      setHasSearched(true);

      try {
        const searchParams: any = {
          limit: pagination.limit,
          page: page,
        };

        if (filters.serviceType) searchParams.serviceType = filters.serviceType;
        if (filters.mediaType) searchParams.mediaType = filters.mediaType;
        if (filters.location) searchParams.state = filters.location;
        if (filters.minRate) searchParams.minRate = filters.minRate;
        if (filters.maxRate) searchParams.maxRate = filters.maxRate;

        const response = await billboardService.searchBillboards(searchParams);
        
        const fetchedResults = response.foundItems || [];
        
        const transformedResults: Billboard[] = fetchedResults.map((item: any) => ({
          id: item._id,
          _id: item._id,
          title: `${item.mediaType || "Billboard"} at ${item.locationAddress || "Prime Location"}`,
          location: `${item.locationAddress}, ${item.city}, ${item.state}`,
          price: `₦${item.rate?.toLocaleString() || "0"} / month`,
          image: item.photos?.[0] || item.images?.[0] || "/billboard-placeholder.jpg",
          size: `${item.height || 12}m x ${item.width || 24}m`,
          impressions: `${Math.floor(Math.random() * 200) + 50}k daily`,
          mediaType: item.mediaType,
          locationAddress: item.locationAddress,
          city: item.city,
          state: item.state,
          rate: item.rate,
          availableDate: item.availableDate,
          rating: item.rating,
          description: item.description,
        }));

        setResults(transformedResults);
        setPagination({
          page: response.page || page,
          limit: pagination.limit,
          total: response.count || transformedResults.length,
          totalPages: response.totalPages || Math.ceil((response.count || transformedResults.length) / pagination.limit),
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
    [mounted, pagination.limit, filters]
  );

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateUrl(newFilters);
  }, [filters, updateUrl]);

  // Auto search when mounted
  useEffect(() => {
    if (mounted && !assetsLoading && filters.mediaType && !initialSearchDoneRef.current) {
      initialSearchDoneRef.current = true;
      handleSearch(1);
    }
  }, [mounted, assetsLoading, filters.mediaType, handleSearch]);

  const handlePageChange = (page: number) => {
    handleSearch(page);
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  // Get display names
  const getMediaTypeDisplay = () => {
    return formatDisplayText(mediaType as string);
  };

  const getStateDisplay = () => {
    return formatDisplayText(state as string);
  };

  // Prevent hydration mismatch
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

        {/* Header with Breadcrumbs */}
        <section className="relative w-full bg-linear-to-r from-[#0177AB] to-[#003045] pt-24 pb-20 px-18">
          <div className="relative z-20">
            {/* Breadcrumbs */}
            <div className="text-white/80 text-sm mb-4">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/advertise" className="hover:text-white transition">Advertise</Link>
              <span className="mx-2">/</span>
              <span className="text-white capitalize">{getMediaTypeDisplay()}</span>
              <span className="mx-2">/</span>
              <span className="text-white/60">in</span>
              <span className="mx-2">/</span>
              <span className="text-white capitalize">Nigeria</span>
              <span className="mx-2">/</span>
              <span className="text-white capitalize">{getStateDisplay()}</span>
            </div>
            
            {/* Page Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {getMediaTypeDisplay()} in {getStateDisplay()}, Nigeria
            </h1>
            <p className="text-white/80">
              Find the best {getMediaTypeDisplay()} advertising spaces in {getStateDisplay()}
            </p>
          </div>
          
          {/* FLOATING SEARCH */}
          <div className="relative z-20 -mb-38 mt-6">
            <SearchBox
              filters={filters}
              handleFilterChange={handleFilterChange}
              handleSearch={() => handleSearch(1)}
              isLoading={isLoading}
              assets={assets}
              assetsLoading={assetsLoading}
              locations={Object.keys(assets.statesAndCites || {})}
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="pb-12 pt-32 bg-white px-4 sm:px-6 lg:px-18">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-12 md:col-span-3">
              <FilterSidebar
                onFilterChange={handleFilterChange}
                filters={filters}
                assets={assets}
              />
            </div>

            {/* Results Area */}
            <div className="col-span-12 md:col-span-9">
              <ResultsFilterBar
                title={getMediaTypeDisplay()}
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
                    No {getMediaTypeDisplay()} found in {getStateDisplay()}.
                  </p>
                  <button
                    onClick={() => {
                      setFilters({
                        mediaType: "",
                        productType: "",
                        location: "",
                        serviceType: "",
                        minRate: undefined,
                        maxRate: undefined,
                      });
                      initialSearchDoneRef.current = false;
                      handleSearch(1);
                    }}
                    className="mt-6 text-[#0088b5] hover:underline font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Results */}
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
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 rounded-lg text-sm border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg text-sm border ${
                          pagination.page === pageNum
                            ? "bg-[#0177AB] text-white border-[#0177AB]"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 rounded-lg text-sm border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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