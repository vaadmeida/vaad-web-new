// app/components/Billboard/BillboardCard.tsx
"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Star, MapPin, Heart } from "lucide-react";
import { Billboard } from "@/app/lib/billboard/billboard-service";
import { useFavorite } from "@/app/contexts/favorite-context";

// Dynamically import modal to prevent SSR issues
const BillboardModal = dynamic(() => import("./BillboardModal"), {
  ssr: false,
  loading: () => null,
});

interface BillboardCardProps {
  billboard?: Billboard;
}

// Static placeholder - defined outside component to ensure stability
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1612332883331-e8ea07a15f14?q=80&w=774&auto=format&fit=crop";

export default function BillboardCard({ billboard }: BillboardCardProps) {
  // ==========================================
  // PHASE 1: ALL HOOKS AT TOP (NO CONDITIONS)
  // ==========================================
  
  // State hooks - always called in same order
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Context hooks - must be before any conditional logic
  const { isFavorite, toggleFavorite, isHydrated } = useFavorite();

  // ==========================================
  // PHASE 2: MEMOIZED COMPUTATIONS (SAFE)
  // ==========================================

  // Get billboard ID safely
  const billboardId = billboard?._id;

  // Compute favorite status - only after hydration to prevent SSR mismatch
  const isFavorited = useMemo(() => {
    if (!isHydrated || !billboardId) return false;
    return isFavorite(billboardId);
  }, [isHydrated, billboardId, isFavorite]);

  // Safe field extraction with useMemo (deterministic for SSR)
  const fields = useMemo(() => {
    if (!billboard) return null;
    
    return {
      _id: billboard._id,
      mediaType: billboard.mediaType || billboard["mediaType"],
      locationAddress: billboard.locationAddress || billboard.location || billboard["locationAddress"],
      state: billboard.state || billboard["state"],
      rate: billboard.rate || billboard["rate"],
      photos: billboard.photos || billboard["photos"],
      images: billboard.images || billboard["images"],
      rating: billboard.rating || billboard["rating"],
      availableDate: billboard.availableDate || billboard["availableDate"],
      height: billboard.height || billboard.specifications?.height || billboard["height"],
      width: billboard.width || billboard.specifications?.width || billboard["width"],
      units: billboard.units || billboard["units"],
      landmark: billboard.landmark || billboard["landmark"],
      reviews: billboard.reviews || billboard["review"] || billboard["reviews"],
      serviceType: billboard.serviceType || billboard["serviceType"],
      title: billboard.title || billboard["title"],
    };
  }, [billboard]);

  // Calculate available days - wrapped in useMemo for determinism
  const availableIn = useMemo(() => {
    if (!fields?.availableDate) return 0;
    try {
      const available = new Date(fields.availableDate);
      const today = new Date();
      const diffTime = available.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return 0;
    }
  }, [fields?.availableDate]);

  // Derived display values
  const displayTitle = fields?.title || fields?.mediaType || "Billboard";
  
  const displayLocation = fields?.landmark && fields?.locationAddress
    ? fields.locationAddress
    : fields?.locationAddress || fields?.landmark || "Prime Location";
  
  const description = useMemo(() => {
    if (!fields) return "";
    return `${fields.mediaType || "Premium billboard"} located in ${fields.locationAddress || "Prime Location"}, ${fields.state || "Lagos"}. ${fields.height || 12}m x ${fields.width || 24}m ${fields.units || "meters"} format.`;
  }, [fields]);

  // Image URL - computed deterministically
  const imageUrl = useMemo(() => {
    if (imageError) return PLACEHOLDER_IMAGE;
    const photo = fields?.photos?.[0] || fields?.images?.[0];
    return photo || PLACEHOLDER_IMAGE;
  }, [fields?.photos, fields?.images, imageError]);

  const originalPrice = fields?.rate ? Math.round(fields.rate * 1.2) : undefined;

  // ==========================================
  // PHASE 3: CALLBACKS (AFTER STATE, BEFORE RETURN)
  // ==========================================

  const handleViewDetails = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleFavoriteToggle = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Guard inside callback is fine
    if (!billboardId || isPending) return;
    
    setIsPending(true);
    
    try {
      await toggleFavorite(billboardId);
    } catch (error) {
      console.error("Favorite toggle failed:", error);
    } finally {
      setIsPending(false);
    }
  }, [billboardId, isPending, toggleFavorite]);

  // ==========================================
  // PHASE 4: EARLY RETURN (AFTER ALL HOOKS)
  // ==========================================

  if (!billboard || !fields) {
    return null;
  }

  // ==========================================
  // PHASE 5: RENDER (WITH HYDRATION SAFETY)
  // ==========================================

  return (
    <>
      <div
        className="group bg-transparent rounded-t-[7.75px] border-b border-[#C1C4D6] overflow-hidden transition-shadow duration-300 cursor-pointer"
        onClick={handleViewDetails}
      >
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden rounded-[7.75px]">
          <Image
            src={imageUrl}
            alt={displayTitle}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-[7.75px]"
            onError={() => setImageError(true)}
            unoptimized
            priority={false}
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-[#0177AB] backdrop-blur-sm px-[13.57px] py-[2.91px] font-medium rounded-[3.88px] text-xs text-white z-10">
            {fields.serviceType || fields.mediaType || "Billboard"}
          </div>

          {/* Favorite Button - Elite level with hydration safety */}
          <button
            type="button"
            onClick={handleFavoriteToggle}
            disabled={isPending || !isHydrated}
            className={`
              absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all
              ${isHydrated 
                ? "bg-white/90 backdrop-blur-sm hover:bg-white cursor-pointer" 
                : "bg-gray-100 cursor-wait"
              }
              ${isPending ? "opacity-70" : ""}
              disabled:opacity-50
            `}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              size={16}
              className={`
                transition-all duration-300
                ${isFavorited ? "fill-[#0088b5] text-[#0088b5] scale-110" : "text-gray-600 hover:text-[#0088b5]"}
                ${isPending ? "animate-pulse" : ""}
                ${!isHydrated ? "opacity-50" : ""}
              `}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-[#0177AB] text-[#0177AB]" />
              <span className="text-[15.5px] font-medium text-gray-900 ml-0.5">
                {fields.rating || 4.5}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ({fields.reviews || 0} reviews)
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[21.32px] font-semibold text-[#0177AB] mb-1 line-clamp-1">
            {displayTitle}
          </h3>

          {/* Description */}
          <p className="text-[15.5px] text-[#333333] mb-4 font-normal line-clamp-2">
            {description}
          </p>

          {/* Location */}
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[13.57px] font-normal text-[#696F8C]">
                {displayLocation}, {fields.state || "Lagos"}
              </p>
            </div>
          </div>

          <div className="flex gap-7 items-center">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-[31.01px] font-bold text-[#333333]">
                ₦{fields.rate?.toLocaleString("en-US") || "0"}
              </span>
              {originalPrice && (
                <span className="text-[16.47px] text-[#696F8C] line-through font-medium">
                  ₦{originalPrice.toLocaleString("en-US")}
                </span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
              className="w-full block text-center bg-[#F5F9FC] text-[#0177AB] font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-[13.57px] hover:bg-[#0177AB] hover:text-white"
            >
              Available in <span>{availableIn}</span> days
            </button>
          </div>
        </div>
      </div>

      {/* Modal - Only render when open to prevent hydration issues */}
      {isModalOpen && (
        <BillboardModal
          billboard={billboard}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}