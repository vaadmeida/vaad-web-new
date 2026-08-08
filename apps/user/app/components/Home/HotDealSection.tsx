// HotDealsSection.tsx
"use client";

import Link from "next/link";
import { Billboard } from "@/app/lib/billboard/billboard-service";
import DealCard from "../Card/DealCard";
import { motion } from "framer-motion";
import { useBillboards } from "@/app/hooks/useBillboard";
import EmptyState from "./EmptyState/EmptyState";
import { ChevronRight } from "lucide-react";

// Skeleton component for loading state
const DealCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-xl overflow-hidden p-0 border border-gray-100">
    {/* Image skeleton */}
    <div className="relative w-full h-[260px] bg-gray-200">
      <div
        className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"
        style={{ backgroundSize: "200% 100%" }}
      />
    </div>

    {/* Content skeleton */}
    <div className="p-5 space-y-4">
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="h-6 w-20 bg-gray-200 rounded" />
        <div className="h-8 w-24 bg-gray-200 rounded-md" />
      </div>
    </div>
  </div>
);

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

const HotDealsSection = () => {
  const { billboards, loading, error, refetch } = useBillboards();
  
  // Filter and limit hot deals to 3 items
  const hotDeals = billboards.filter((b) => b.hotDeal === true).slice(0, 3);

  // Render billboard card
  const renderBillboardCard = (deal: Billboard) => (
    <DealCard
      key={deal._id}
      title={deal.mediaType || "Billboard"}
      image={deal.photos?.[0] || deal.images?.[0] || "/images/placeholder.jpg"}
      available={deal.rate || 0}
      location={deal.locationAddress || deal.city}
      state={deal.state}
    />
  );

  return (
    <section className=" py-20 px-6 md:px-18">
      <style>{shimmerStyles}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-[6vw] sm:text-3xl font-semibold text-gray-900">
            Hot Deals Section
          </h2>
          <p className="text-[#434141] sm:text-sm text-[3.5vw] mt-3 leading-relaxed">
            Discover limited-time offers on top locations and get more value from your media spend.
          </p>
        </div>

        {/* Loading State - Skeleton Grid (3 Columns) */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-14"
          >
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <DealCardSkeleton />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mt-14">
            <EmptyState
              title="Unable to load deals"
              description="Something went wrong while fetching hot deals. Please try again."
              onRefresh={refetch}
            />
          </div>
        )}

        {/* Empty State - No hot deals */}
        {!loading && !error && hotDeals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-14"
          >
            <EmptyState
              title="No advertisements available"
              description="We're currently updating our inventory. Check back soon for exciting new advertising opportunities."
              onRefresh={refetch}
            />
          </motion.div>
        )}

        {/* Hot Deals Grid (3 Columns) */}
        {!loading && !error && hotDeals.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-14"
            >
              {hotDeals.map((deal, index) => (
                <motion.div
                  key={deal._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  {renderBillboardCard(deal)}
                </motion.div>
              ))}
            </motion.div>

            {/* View All Link Button */}
            <div className="mt-12 text-center">
              <Link
                href="/billboards?hotDeal=true"
                className="inline-flex items-center gap-2 bg-[#0177AB] hover:bg-[#015f8a] text-white px-7 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm"
              >
                View All Deals
                <ChevronRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HotDealsSection;