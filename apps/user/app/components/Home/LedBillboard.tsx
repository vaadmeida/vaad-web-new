/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BillboardCard from "@/app/components/billboard/BillboardCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useBillboards } from "@/app/hooks/useBillboard";
import EmptyState from "./EmptyState/EmptyState";
import SectionHeader from "../SectionHeader";
import { motion } from "framer-motion";

interface LedBillboardSectionProps {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  limit?: number;
}

// Shimmer animation styles
const shimmerStyles = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .animate-shimmer {
    animation: shimmer 1.5s infinite;
  }
`;

function BillboardSkeletonCard() {
  return (
    <div className="animate-pulse">
      {/* Image skeleton with shimmer */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-[7.75px] bg-gray-200">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" 
          style={{ backgroundSize: '200% 100%' }} 
        />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full" />
          <div className="h-4 bg-gray-200 rounded w-12" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        
        <div className="flex items-start gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full shrink-0" />
          <div className="h-4 bg-gray-200 rounded w-4/5" />
        </div>
        
        <div className="flex justify-between items-center gap-3 pt-2">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded w-2/5" />
        </div>
      </div>
    </div>
  );
}

function BillboardSkeletonGrid({ count }: { count: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <BillboardSkeletonCard />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function LedBillboardSection({
  title = "LED Billboards",
  subtitle = "",
  showViewAll = true,
  limit = 4,
}: LedBillboardSectionProps) {
  const { billboards, loading, error, refetch } = useBillboards({
    mediaType: "LED Billboard",
  });

  const displayedBillboards = billboards.slice(0, limit);
  const hasMore = billboards.length > 3;   // ← Changed to > 3 as requested

  // Loading skeleton
  if (loading) {
    return (
      <section className="sm:p-18 px-5 py-14 bg-white">
        <style>{shimmerStyles}</style>
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0D0A19] mb-3">
                {title}
              </h2>
              <p className="text-gray-600 max-w-2xl">{subtitle}</p>
            </div>

            {/* Show View All in loading state only if showViewAll is true */}
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

          <BillboardSkeletonGrid count={limit} />
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
    <section className="sm:px-18 px-5 pt-14 bg-white">
      <div className="mx-auto">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          showViewAll={showViewAll && hasMore}   // ← Key change: only show if hasMore
        />

        {billboards.length > 0 && (
          <p className="text-sm text-gray-500 mb-6">
            Showing {displayedBillboards.length} of {billboards.length} LED billboards
            {hasMore && " (more available)"}
          </p>
        )}

        {displayedBillboards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedBillboards.map((billboard) => (
              <BillboardCard key={billboard._id} billboard={billboard} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No advertisements available"
            description="We're currently updating our inventory. Check back soon for exciting new advertising opportunities."
            onRefresh={refetch}
          />
        )}

        {/* Mobile "View All" button - only show if more than 3 items */}
        {hasMore && showViewAll && (
          <div className="mt-10 text-center md:hidden">
            <Link
              href="/billboards"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#F5F9FC] hover:bg-[#0177AB] text-[#0177AB] hover:text-white font-medium rounded-xl transition-all duration-200 shadow-sm"
            >
              Explore All {billboards.length} LED Billboards
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}