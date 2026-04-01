// HotDealsSection.tsx
"use client";

import { Billboard } from "@/app/lib/billboard/billboard-service";
import DealCard from "../Card/DealCard";
import { motion } from "framer-motion";
import { useBillboards } from "@/app/hooks/useBillboard";
import EmptyState from "./EmptyState/EmptyState";

// Skeleton component for loading state
const DealCardSkeleton = () => (
  <div className="animate-pulse">
    {/* Image skeleton */}
    <div className="relative w-full h-[280px] rounded-xl overflow-hidden bg-gray-200">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" 
        style={{ backgroundSize: '200% 100%' }} />
    </div>
    
    {/* Content skeleton */}
    <div className="flex items-start justify-between mt-4 gap-2">
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="h-5 w-5 bg-gray-200 rounded-full shrink-0" />
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
  const hotDeals = billboards.filter((b) => b.hotDeal === true);

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
    <section className="bg-[#F0EFFB] py-20 px-6 md:px-18">
      <style>{shimmerStyles}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-[6vw] sm:text-3xl font-semibold text-gray-900">
            Hot Deals Section
          </h2>
          <p className="text-gray-500 sm:text-sm text-[3.5vw] mt-3 leading-relaxed">
            Choose from hundreds of billboard spots strategically placed for
            maximum visibility and impact.
          </p>
        </div>

        {/* Loading State - Skeleton Grid */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-14"
          >
            {[...Array(4)].map((_, index) => (
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

        {/* Hot Deals Grid */}
        {!loading && !error && hotDeals.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-14"
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
        )}
      </div>
    </section>
  );
};

export default HotDealsSection;