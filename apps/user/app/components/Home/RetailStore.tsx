/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BillboardCard from "@/app/components/billboard/BillboardCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useBillboards } from "@/app/hooks/useBillboard";
import EmptyState from "./EmptyState/EmptyState";

interface RetailStoreSectionProps {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  limit?: number;
}

export default function RetailStoreSection({
  title = "Retail Store Advertising",
  subtitle = "From idea to installation - we make outdoor advertising easy, measurable, and unforgettable.",
  showViewAll = false,
  limit = 3,
}: RetailStoreSectionProps) {
  const { billboards, loading, error, refetch } = useBillboards({
    mediaType: "Retail Store",
  });

  // Slice for display
  const displayedBillboards = billboards.slice(0, limit);
  const hasMore = billboards.length > limit;

  // Loading skeleton
  if (loading) {
    return (
      <section className="p-18 bg-white">
        <div className="mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0D0A19] mb-3">
                {title}
              </h2>
              <p className="text-[#333333] max-w-[500px] font-normal text-[17.44px]">
                {subtitle}
              </p>
            </div>

            {showViewAll && (
              <Link
                href="/billboards"
                className="inline-flex underline underline-offset-4 items-center gap-2 text-[#0D0A19] hover:text-[#0177AB] font-medium text-[17.44px] mt-4 md:mt-0 group"
              >
                <span>Explore All</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-t-[7.75px] h-48 w-full"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="p-18 bg-white">
        <div className="mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-[#0D0A19] mb-2">{title}</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-[#0177AB] text-white rounded-lg hover:bg-[#006d91] transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="p-18 bg-white">
      <div className="mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D0A19] mb-3">
              {title}
            </h2>
            <p className="text-[#333333] max-w-[500px] font-normal text-[17.44px]">
              {subtitle}
            </p>
          </div>

          {showViewAll && (
            <Link
              href="/billboards"
              className="inline-flex underline underline-offset-4 items-center gap-2 text-[#0D0A19] hover:text-[#0177AB] font-medium text-[17.44px] mt-4 md:mt-0 group"
            >
              <span>Explore All</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {billboards.length > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            Showing {displayedBillboards.length} of {billboards.length} retail
            store advertisements
            {hasMore && " (more available)"}
          </p>
        )}

        {displayedBillboards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedBillboards.map((billboard) => (
              <BillboardCard
                key={billboard._id}
                billboard={billboard}
                onBookmark={() => console.log("Bookmark:", billboard._id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No retail store advertisements available"
            description="We're currently updating our inventory. Check back soon for exciting new advertising opportunities."
            onRefresh={refetch}
          />
        )}

        {/* View More on Mobile (if needed) */}
        {hasMore && showViewAll && (
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/billboards"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F5F9FC] text-[#0177AB] font-medium rounded-lg hover:bg-[#0177AB] hover:text-white transition-colors"
            >
              View All {billboards.length} Retail Store Ads
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
