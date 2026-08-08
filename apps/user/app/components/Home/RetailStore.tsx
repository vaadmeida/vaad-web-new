/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BillboardCard from "@/app/components/billboard/BillboardCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useBillboards } from "@/app/hooks/useBillboard";
import EmptyState from "./EmptyState/EmptyState";
import SectionHeader from "../SectionHeader";
import { motion } from "framer-motion";

interface RetailStoreSectionProps {
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
        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full" />
          <div className="h-4 bg-gray-200 rounded w-12" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        
        {/* Description skeleton */}
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        
        {/* Location skeleton */}
        <div className="flex items-start gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full shrink-0" />
          <div className="h-4 bg-gray-200 rounded w-4/5" />
        </div>
        
        {/* Price and button skeleton */}
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

export default function RetailStoreSection({
  title = "Retail Store Advertising",
  subtitle = "Connect with customers at the point of decision and influence purchasing behavior in real time.",
  showViewAll = false,
  limit = 3,
}: RetailStoreSectionProps) {
  const { billboards, loading, error, refetch } = useBillboards({
    mediaType: "Retail Store",
  });

  const displayedBillboards = billboards.slice(0, limit);

  // Updated: Show "Explore All" only if more than 3 billboards
  const hasMore = billboards.length > 3;

  // Loading skeleton with shimmer animation
  if (loading) {
    return (
      <section className="bg-white py-20 px-6 md:px-18">
        <style>{shimmerStyles}</style>
        <div className="mx-auto">
          <SectionHeader
            title={title}
            subtitle={subtitle}
            showViewAll={showViewAll}
          />
          <BillboardSkeletonGrid count={limit} />
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-white py-20 px-6 md:px-18">
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
    <section className="bg-white pt-4 pb-20 px-6 md:px-18">
      <div className="mx-auto">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          showViewAll={showViewAll && hasMore}   // Only show if > 3 and allowed
        />

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

        {/* Mobile "Explore All" button - only shown when more than 3 and showViewAll is true */}
        {hasMore && showViewAll && (
          <div className="mt-10 text-center md:hidden">
            <Link
              href="/billboards"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#F5F9FC] hover:bg-[#0177AB] text-[#0177AB] hover:text-white font-medium rounded-xl transition-all duration-200 shadow-sm"
            >
              Explore All {billboards.length} Retail Store Ads
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}