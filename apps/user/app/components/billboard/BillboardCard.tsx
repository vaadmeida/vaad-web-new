// app/components/Billboard/BillboardCard.tsx
"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Heart } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Billboard } from "@/app/lib/billboard/billboard-service";
import { useFavorite } from "@/app/contexts/favorite-context";

interface BillboardCardProps {
  billboard?: Billboard;
}

// Helper function to generate SEO-friendly slug
const generateBillboardSlug = (billboard: Billboard): string => {
  const mediaType = (billboard.mediaType || "billboard")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  
  // const city = (billboard.city || billboard.locationAddress || "location")
  //   .toLowerCase()
  //   .replace(/[^a-z0-9]+/g, "-")
  //   .replace(/^-|-$/g, "");
  
  const id = billboard._id;
  
  return `/${mediaType}/${id}`;
};

// Multiple fallback images for reliability
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1612332883331-e8ea07a15f14?q=80&w=774&auto=format&fit=crop",
  "https://images.pexels.com/photos/2104763/pexels-photo-2104763.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=774&auto=format&fit=crop",
];

// INSANE HEART ANIMATION VARIANTS - Ultimate Premium
const heartVariants: Variants = {
  idle: { 
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
    transition: { duration: 0.2 }
  },
  explode: {
    scale: [1, 2.2, 1.8, 2.5, 1.2, 0.9, 1],
    rotate: [0, -25, 35, -20, 15, -8, 0],
    filter: [
      "blur(0px)",
      "blur(2px)",
      "blur(4px)",
      "blur(2px)",
      "blur(0px)",
      "blur(0px)",
      "blur(0px)"
    ],
    transition: {
      duration: 1.2,
      ease: [0.68, -0.55, 0.265, 1.55],
      times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1]
    }
  },
  shockwave: {
    scale: [1, 1.3, 1.8, 2.2, 1.5, 1.1, 1],
    rotate: [0, 45, -30, 25, -15, 8, 0],
    transition: {
      duration: 0.8,
      ease: "backOut",
      times: [0, 0.2, 0.35, 0.5, 0.65, 0.85, 1]
    }
  },
  glitch: {
    scale: [1, 1.1, 0.95, 1.2, 0.9, 1.1, 1],
    rotate: [0, 3, -2, 4, -3, 2, 0],
    x: [0, -2, 2, -1, 1, 0, 0],
    y: [0, 1, -1, 2, -2, 0, 0],
    filter: [
      "blur(0px)",
      "blur(1px)",
      "blur(0px)",
      "blur(2px)",
      "blur(0px)",
      "blur(0px)",
      "blur(0px)"
    ],
    transition: {
      duration: 0.5,
      ease: "linear"
    }
  },
  bounceCrazy: {
    scale: [1, 1.6, 0.7, 1.4, 0.8, 1.2, 0.95, 1.1, 1],
    rotate: [0, -30, 45, -25, 35, -20, 15, -8, 0],
    y: [0, -20, 10, -15, 8, -10, 5, -3, 0],
    transition: {
      duration: 1,
      ease: [0.68, -0.55, 0.265, 1.55],
      times: [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.86, 1]
    }
  }
};

// Particle explosion variants
const particleVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  explode: (i: number) => {
    const angle = (i / 16) * Math.PI * 2;
    const radius = 40 + Math.random() * 20;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return {
      scale: [0, 1.2, 0.8, 0],
      opacity: [0, 1, 0.8, 0],
      x: [0, x * 0.6, x * 0.9, x],
      y: [0, y * 0.6, y * 0.9, y],
      rotate: [0, Math.random() * 360],
      transition: {
        duration: 0.8,
        delay: i * 0.02,
        ease: "easeOut"
      }
    };
  },
  exit: { scale: 0, opacity: 0, transition: { duration: 0.1 } }
};

// Sparkle ring variants
const ringVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  expand: {
    scale: [0, 1.5, 2, 2.5, 3],
    opacity: [0.8, 0.6, 0.4, 0.2, 0],
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

// Color flash variants
const flashVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.7, 0.5, 0.3, 0],
    transition: { duration: 0.5 }
  }
};

export default function BillboardCard({ billboard }: BillboardCardProps) {
  // State
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentFallbackIndex, setCurrentFallbackIndex] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [heartState, setHeartState] = useState<"idle" | "explode" | "shockwave" | "glitch" | "bounceCrazy">("idle");
  const [showParticles, setShowParticles] = useState(false);
  const [showRing, setShowRing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [particleColor, setParticleColor] = useState("#0088b5");
  
  const animationTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const { isFavorite, toggleFavorite, isHydrated } = useFavorite();

  const billboardId = billboard?._id;

  const isFavorited = useMemo(() => {
    if (!isHydrated || !billboardId) return false;
    return isFavorite(billboardId);
  }, [isHydrated, billboardId, isFavorite]);

  const fields = useMemo(() => {
    if (!billboard) return null;
    return {
      _id: billboard._id,
      mediaType: billboard.mediaType || billboard["mediaType"],
      locationAddress: billboard.locationAddress || billboard.location || billboard["locationAddress"],
      city: billboard.city || billboard["city"],
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

  const displayTitle = fields?.title || fields?.mediaType || "Billboard";
  const displayLocation = fields?.landmark && fields?.locationAddress
    ? fields.locationAddress
    : fields?.locationAddress || fields?.landmark || "Prime Location";
  
  const description = useMemo(() => {
    if (!fields) return "";
    return `${fields.mediaType || "Premium billboard"} located in ${fields.locationAddress || "Prime Location"}, ${fields.state || "Lagos"}. ${fields.height || 12}m x ${fields.width || 24}m ${fields.units || "meters"} format.`;
  }, [fields]);

  // Progressive image loading with fallback chain
  const getCurrentImageUrl = useMemo(() => {
    if (imageError) {
      return FALLBACK_IMAGES[currentFallbackIndex % FALLBACK_IMAGES.length];
    }
    const photo = fields?.photos?.[0] || fields?.images?.[0];
    return photo || FALLBACK_IMAGES[0];
  }, [fields?.photos, fields?.images, imageError, currentFallbackIndex]);

  const originalPrice = fields?.rate ? Math.round(fields.rate * 1.2) : undefined;

  // Handle image load error with fallback chain
  const handleImageError = useCallback(() => {
    if (currentFallbackIndex < FALLBACK_IMAGES.length - 1) {
      setCurrentFallbackIndex(prev => prev + 1);
      setImageLoading(true);
    } else {
      setImageError(true);
      setImageLoading(false);
    }
  }, [currentFallbackIndex]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  // Random animation selector
  const getRandomAnimation = useCallback(() => {
    const animations: ("explode" | "shockwave" | "glitch" | "bounceCrazy")[] = [
      "explode",
      "shockwave", 
      "glitch",
      "bounceCrazy"
    ];
    return animations[Math.floor(Math.random() * animations.length)];
  }, []);

  // Clear all timeouts
  const clearAllTimeouts = useCallback(() => {
    animationTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
    animationTimeoutRef.current = [];
  }, []);

  const triggerInsaneAnimation = useCallback(() => {
    clearAllTimeouts();
    
    const randomAnim = getRandomAnimation();
    const heartColor = isFavorited ? "#0088b5" : "#ff6b6b";
    setParticleColor(heartColor);
    
    setShowFlash(true);
    
    setHeartState(randomAnim);
    
    const ringTimeout = setTimeout(() => {
      setShowRing(true);
    }, 50);
    animationTimeoutRef.current.push(ringTimeout);
    
    const particleTimeout = setTimeout(() => {
      setShowParticles(true);
    }, 100);
    animationTimeoutRef.current.push(particleTimeout);
    
    const resetTimeout = setTimeout(() => {
      setHeartState("idle");
      setShowParticles(false);
      setShowRing(false);
      setShowFlash(false);
    }, 1200);
    animationTimeoutRef.current.push(resetTimeout);
  }, [getRandomAnimation, isFavorited, clearAllTimeouts]);

  const handleFavoriteToggle = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!billboardId || isPending) return;
    
    triggerInsaneAnimation();
    
    setIsPending(true);
    
    try {
      await toggleFavorite(billboardId);
    } catch (error) {
      console.error("Favorite toggle failed:", error);
      clearAllTimeouts();
      setHeartState("idle");
      setShowParticles(false);
      setShowRing(false);
      setShowFlash(false);
    } finally {
      setIsPending(false);
    }
  }, [billboardId, isPending, toggleFavorite, triggerInsaneAnimation, clearAllTimeouts]);

  useEffect(() => {
    return () => clearAllTimeouts();
  }, [clearAllTimeouts]);

  if (!billboard || !fields) {
    return null;
  }

  // Generate the SEO-friendly URL
  const billboardUrl = generateBillboardSlug(billboard);

  return (
    <Link
      href={billboardUrl}
      className="group bg-[#FAFAFB] rounded-[12px] p-5 overflow-hidden transition-shadow duration-300 cursor-pointer block"
    >
      {/* Image Container */}
      <div className="relative h-[264px] w-full overflow-hidden rounded-[8px] bg-gray-100">
        {/* Loading Skeleton */}
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-2 border-[#0088b5] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Image */}
        <img
          src={getCurrentImageUrl}
          alt={displayTitle}
          className={`
            w-full h-full object-cover transition-opacity duration-300
            group-hover:scale-105 transition-transform duration-500
            ${imageLoading ? "opacity-0" : "opacity-100"}
          `}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />

        {/* Category Badge */}
       <div className='flex justify-between items-start absolute top-3 px-3 w-full'>
         <div className=" bg-[#55A4C7] backdrop-blur-sm px-[13.57px] py-[2.91px] font-medium rounded-[6px] text-xs text-white z-10">
          {/* {fields.serviceType || fields.mediaType || "Billboard"} */}
          Available
        </div>

         <div className=" bg-[#E7F8F2] backdrop-blur-sm px-[13.57px] py-[2.91px] font-medium rounded-full text-xs text-[#0B835C] z-10">
          {/* {fields.serviceType || fields.mediaType || "Billboard"} */}
          Booked . 2d
        </div>
       </div>

        {/* INSANE ANIMATED FAVORITE BUTTON */}
         <div className="absolute bottom-3 right-3 z-20">
          {/* Color Flash Effect */}
          <AnimatePresence>
            {showFlash && (
              <motion.div
                variants={flashVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${particleColor}, transparent)`,
                  filter: "blur(8px)"
                }}
              />
            )}
          </AnimatePresence>

          {/* Shockwave Ring Effect */}
          <AnimatePresence>
            {showRing && (
              <motion.div
                variants={ringVariants}
                initial="hidden"
                animate="expand"
                exit="hidden"
                className="absolute inset-0 rounded-full border-2"
                style={{
                  borderColor: particleColor,
                  boxShadow: `0 0 20px ${particleColor}`
                }}
              />
            )}
          </AnimatePresence>

          {/* Heart Button */}
          <motion.button
            type="button"
            onClick={handleFavoriteToggle}
            disabled={isPending || !isHydrated}
            className={`
              relative w-8 h-8 rounded-full flex items-center justify-center transition-all
              ${isHydrated 
                ? "bg-white/90 backdrop-blur-sm hover:bg-white" 
                : "bg-gray-100 cursor-wait"
              }
              ${isPending ? "opacity-70" : ""}
              disabled:opacity-50
              overflow-visible
              z-10
            `}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            whileTap={{ scale: 0.7 }}
            animate={heartState}
            variants={heartVariants}
            initial="idle"
          >
            <Heart
              size={16}
              className={`
                transition-colors duration-200
                ${isFavorited ? "fill-[#0088b5] text-[#0088b5]" : "text-gray-600 group-hover:text-[#0088b5]"}
                ${!isHydrated ? "opacity-50" : ""}
              `}
            />
          </motion.button>

          {/* Particle Explosion */}
          <AnimatePresence>
            {showParticles && (
              <>
                {[...Array(24)].map((_, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={particleVariants}
                    initial="hidden"
                    animate="explode"
                    exit="exit"
                    className="absolute top-1/2 left-1/2 pointer-events-none"
                    style={{
                      width: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 3,
                      height: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 3,
                      background: `radial-gradient(circle, ${particleColor}, ${particleColor}80)`,
                      borderRadius: i % 4 === 0 ? '2px' : '50%',
                      filter: 'blur(0.5px)',
                      boxShadow: `0 0 4px ${particleColor}`
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className='w-full h-px border border-[#d5d4d45e] my-5'/>

      {/* Content */}
      <div className="">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-[#bfa900] text-[#bfa900]" />
            <span className="text-[16px] font-medium text-[#626060] ml-0.5">
              {fields.rating || 4.5}
            </span>
          </div>
          <span className="text-medium text-[#626060] text-[16px]">
            ({fields.reviews || 0} reviews)
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[24px] font-bold text-[#141212] mb-1 line-clamp-1">
          {displayTitle}
        </h3>

        {/* Description */}
        <p className="text-[16px] text-[#626060] mb-10 font-normal line-clamp-2">
          {description}
        </p>

        {/* Location */}
        <div className="flex items-start gap-2 mb-2">
          {/* <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" /> */}
          <div>
            <p className="text-[14px] font-normal text-[#626060]">
              {displayLocation}, {fields.state || "Lagos"}
            </p>
          </div>
        </div>

        <div className="flex justify-between gap-2 items-end">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-semibold text-black">
              ₦{fields.rate?.toLocaleString("en-US") || "0"}
            </span>
            {originalPrice && (
              <span className="text-[16.47px] text-[#696F8C] font-medium">
                {/* ₦{originalPrice.toLocaleString("en-US")} */}
                / pole
              </span>
            )}
          </div>

           <Link
                            href=""
                            className="px-4 py-2.5 bg-[#0088b5] hover:bg-[#007a9e] text-white rounded-xl font-semibold text-sm transition-all"
                          >
                            Book Now
                          </Link>
        </div>
      </div>
    </Link>
  );
}