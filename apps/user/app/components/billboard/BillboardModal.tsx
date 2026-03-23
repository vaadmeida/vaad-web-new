// app/components/Billboard/BillboardModal.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  MapPin,
  Star,
  Eye,
  Clock,
  Ruler,
  Tag,
  Users,
  Phone,
  Heart,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Share2,
  Maximize2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useFavorite } from "@/app/contexts/favorite-context";


// Properly typed Billboard interface
interface Billboard {
  _id: string;
  mediaType?: string;
  locationAddress?: string;
  location?: string;
  state?: string;
  city?: string;
  rate?: number;
  photos?: string[];
  images?: string[];
  rating?: number;
  availableDate?: string;
  height?: number;
  width?: number;
  specifications?: {
    height?: number;
    width?: number;
  };
  units?: string;
  landmark?: string;
  reviews?: number;
  serviceType?: string;
  impressions?: number;
  orientation?: string;
  features?: string[];
  targetAudience?: string[] | string;
  description?: string;
}

interface BillboardModalProps {
  billboard: Billboard | null;
  isOpen: boolean;
  onClose: () => void;
}

// Fixed animation variants with proper typing
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 10,
    transition: { duration: 0.25 },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

const imageVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3 },
  }),
};

// Utility functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const calculateAvailableDays = (availableDate?: string): number => {
  if (!availableDate) return 0;
  try {
    const available = new Date(availableDate);
    const today = new Date();
    const diffTime = available.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
  } catch {
    return 0;
  }
};

export default function BillboardModal({
  billboard,
  isOpen,
  onClose,
}: BillboardModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageDirection, setImageDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [scrollShadowVisible, setScrollShadowVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  const { toggleFavorite, isFavorite } = useFavorite();

  // Data normalization
  const data = useCallback(() => {
    if (!billboard) return null;

    const mediaType = billboard.mediaType || "Billboard";
    const locationAddress =
      billboard.locationAddress || billboard.location || "Prime Location";
    const state = billboard.state || "Lagos";
    const city = billboard.city || "";
    const rate = billboard.rate || 0;

    const allImages = billboard.photos?.length
      ? billboard.photos
      : billboard.images?.length
        ? billboard.images
        : ["/billboard-placeholder.jpg"];

    const rating = billboard.rating || 4.5;
    const reviews = billboard.reviews || 150;
    const impressions = billboard.impressions || 10000;
    const height = billboard.height || billboard.specifications?.height || 12;
    const width = billboard.width || billboard.specifications?.width || 24;
    const units = billboard.units || "meters";
    const orientation = billboard.orientation || "landscape";
    const landmark = billboard.landmark;
    const serviceType = billboard.serviceType || "Outdoor Advertising";
    const features = billboard.features || [];
    const availableDate = billboard.availableDate;

    let targetAudience: string[] = [];
    if (Array.isArray(billboard.targetAudience)) {
      targetAudience = billboard.targetAudience;
    } else if (typeof billboard.targetAudience === "string") {
      targetAudience = [billboard.targetAudience];
    } else {
      targetAudience = [
        "Mass Market Consumers",
        "Urban Professionals",
        "Commuters",
      ];
    }

    const displayLocation = landmark
      ? `${locationAddress}, ${landmark}`
      : locationAddress;
    const locationString = city
      ? `${displayLocation}, ${city}, ${state}`
      : `${displayLocation}, ${state}`;

    return {
      _id: billboard._id,
      mediaType,
      locationAddress,
      state,
      city,
      rate,
      images: allImages,
      rating,
      reviews,
      impressions,
      height,
      width,
      units,
      orientation,
      landmark,
      serviceType,
      features,
      targetAudience,
      locationString,
      availableDate,
      description: billboard.description,
    };
  }, [billboard])();

  const isFavorited = data ? isFavorite(data._id) : false;

  // Image navigation functions - defined before useEffect
  const handleNextImage = useCallback(() => {
    if (!data) return;
    setImageDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % data.images.length);
    setIsImageLoading(true);
  }, [data]);

  // Static placeholder - defined outside component to ensure stability
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1612332883331-e8ea07a15f14?q=80&w=774&auto=format&fit=crop";

  const handlePrevImage = useCallback(() => {
    if (!data) return;
    setImageDirection(-1);
    setCurrentImageIndex(
      (prev) => (prev - 1 + data.images.length) % data.images.length
    );
    setIsImageLoading(true);
  }, [data]);

  // Keyboard navigation - now after functions are defined
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrevImage, handleNextImage]);

  // Scroll shadow detection
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const hasOverflow = el.scrollHeight > el.clientHeight;
      const isScrolled = el.scrollTop > 10;
      setScrollShadowVisible(hasOverflow && !isScrolled);
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);

    el.addEventListener("scroll", update);

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [data]);

  // Body scroll lock + focus trap
  useEffect(() => {
    if (isOpen) {
      lastFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      setTimeout(() => modalRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      lastFocusedElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      setImageDirection(index > currentImageIndex ? 1 : -1);
      setCurrentImageIndex(index);
      setIsImageLoading(true);
    },
    [currentImageIndex]
  );

  const handleShare = useCallback(async () => {
    if (!data) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${data.mediaType} at ${data.locationAddress}`,
          text: `Check out this ${data.mediaType} in ${data.state}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareTooltip(true);
        setTimeout(() => setShowShareTooltip(false), 2000);
      }
    } catch {}
  }, [data]);

  const handleFavoriteToggle = useCallback(async () => {
    if (!data || isUpdating) return;
    setIsUpdating(true);
    try {
      await toggleFavorite(data._id);
    } finally {
      setIsUpdating(false);
    }
  }, [data, toggleFavorite, isUpdating]);

  if (!isOpen || !data) return null;

  const daysUntilAvailable = calculateAvailableDays(data.availableDate);
  const isAvailable = daysUntilAvailable === 0;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
              {/* Header Actions */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="w-10 h-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg border border-gray-200 dark:border-gray-700"
                  aria-label="Share"
                >
                  <Share2
                    size={18}
                    className="text-gray-700 dark:text-gray-200"
                  />
                  <AnimatePresence>
                    {showShareTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap"
                      >
                        Link copied!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFavoriteToggle}
                  disabled={isUpdating}
                  className="w-10 h-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                  aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart
                    size={18}
                    className={`transition-colors ${isFavorited ? "fill-rose-500 text-rose-500" : "text-gray-700 dark:text-gray-200"}`}
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-10 h-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg border border-gray-200 dark:border-gray-700"
                  aria-label="Close modal"
                >
                  <X size={18} className="text-gray-700 dark:text-gray-200" />
                </motion.button>
              </div>

              <div className="flex flex-col lg:flex-row min-h-0 flex-1 overflow-hidden">
                {/* Left - Image Gallery */}
                <div
                  className={`relative bg-gray-100 dark:bg-gray-800 ${
                    isFullscreen ? "fixed inset-0 z-50" : "lg:w-3/5 h-96 lg:h-auto"
                  }`}
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <AnimatePresence
                      initial={false}
                      custom={imageDirection}
                      mode="popLayout"
                    >
                      <motion.div
                        key={currentImageIndex}
                        custom={imageDirection}
                        variants={imageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0"
                      >
                        <Image
                          src={PLACEHOLDER_IMAGE}
                          alt={`${data.mediaType} view ${currentImageIndex + 1}`}
                          fill
                          className="object-cover"
                          onLoad={() => setIsImageLoading(false)}
                          priority={currentImageIndex === 0}
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          unoptimized
                        />
                      </motion.div>
                    </AnimatePresence>

                    {isImageLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
                      >
                        <div className="relative">
                          <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 rounded-full animate-spin" />
                        </div>
                      </motion.div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {data.images.length > 1 && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 border border-white/30"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={24} className="text-white" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 border border-white/30"
                          aria-label="Next image"
                        >
                          <ChevronRight size={24} className="text-white" />
                        </motion.button>
                      </>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 border border-white/30"
                      aria-label={
                        isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                      }
                    >
                      <Maximize2 size={18} className="text-white" />
                    </motion.button>

                    <div className="absolute top-4 left-4 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                      {currentImageIndex + 1} / {data.images.length}
                    </div>

                    <div className="absolute bottom-4 left-4">
                      <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-lg">
                        {data.mediaType}
                      </span>
                    </div>

                    {data.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-2xl">
                        {data.images.slice(0, 5).map((img, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleThumbnailClick(idx)}
                            className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                              idx === currentImageIndex ? "border-white" : "border-transparent"
                            }`}
                            aria-label={`Image ${idx + 1}`}
                          >
                            <Image
                              src={img}
                              alt={`Thumbnail ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </motion.button>
                        ))}
                        {data.images.length > 5 && (
                          <div className="w-12 h-12 rounded-lg bg-black/50 flex items-center justify-center text-white text-xs font-medium">
                            +{data.images.length - 5}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right - Details + Sticky CTA */}
                <motion.div
                  variants={contentVariants}
                  className="lg:w-2/5 flex flex-col min-h-0 bg-white dark:bg-gray-900 relative"
                >
                  {/* Scrollable content */}
                  <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 pb-32 lg:pb-8 custom-scrollbar relative"
                  >
                    {/* Scroll indicator */}
                    <AnimatePresence>
                      {scrollShadowVisible && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 z-10"
                        />
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {scrollShadowVisible && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 0.9, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.4 }}
                          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 bg-black/75 text-white text-xs font-medium rounded-full backdrop-blur-md shadow-lg"
                        >
                          Scroll for more
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Title */}
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h1
                          id="modal-title"
                          className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight"
                        >
                          {data.mediaType}
                        </h1>
                        <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-900/30 rounded-full shrink-0">
                          <Star
                            size={16}
                            className="fill-amber-400 text-amber-400"
                          />
                          <span className="font-semibold text-amber-700 dark:text-amber-400">
                            {data.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <MapPin
                          size={16}
                          className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                        />
                        <span>{data.locationString}</span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100 dark:border-gray-800">
                      <div className="text-center">
                        <div className="flex justify-center mb-1">
                          <Eye
                            size={18}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                        <p className="text-xl font-bold">
                          {formatNumber(data.impressions)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Impressions/day
                        </p>
                      </div>
                      <div className="text-center border-x border-gray-100 dark:border-gray-800">
                        <div className="flex justify-center mb-1">
                          <Users
                            size={18}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                        <p className="text-xl font-bold">{data.reviews}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Reviews
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center mb-1">
                          <Clock
                            size={18}
                            className={
                              isAvailable ? "text-green-500" : "text-amber-500"
                            }
                          />
                        </div>
                        <p className="text-xl font-bold">
                          {isAvailable ? "Now" : `${daysUntilAvailable}d`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Available
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          ₦{data.rate.toLocaleString()}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-lg">
                          /day
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle2 size={16} />
                        <span>Instant booking • No card needed</span>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
                        Specifications
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                            <Ruler
                              size={20}
                              className="text-blue-600 dark:text-blue-400"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Size
                            </p>
                            <p className="font-semibold">
                              {data.height}m × {data.width}m
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                            <Tag
                              size={20}
                              className="text-purple-600 dark:text-purple-400"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Orientation
                            </p>
                            <p className="font-semibold capitalize">
                              {data.orientation}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                            <TrendingUp
                              size={20}
                              className="text-green-600 dark:text-green-400"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Traffic
                            </p>
                            <p className="font-semibold">High Volume</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center">
                            <Calendar
                              size={20}
                              className="text-amber-600 dark:text-amber-400"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Type
                            </p>
                            <p className="font-semibold">{data.serviceType}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    {data.features.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
                          Features
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {data.features.slice(0, 8).map((feature, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm border border-gray-200 dark:border-gray-700"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Target Audience */}
                    {data.targetAudience.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
                          Target Audience
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {data.targetAudience.map((audience, i) => (
                            <span
                              key={i}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm border border-blue-100 dark:border-blue-800"
                            >
                              <Users size={14} />
                              {audience}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
                        About this location
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        {data.description ||
                          `Premium ${data.mediaType} in a high-visibility ${data.orientation} format (${data.height}m × ${data.width}m). Located at ${data.locationString}, this spot delivers excellent reach for brands targeting ${data.state}'s active audience.`}
                      </p>
                    </div>
                  </div>

                  {/* Sticky CTA */}
                  <div className="sticky bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-5 shadow-[0_-6px_16px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_-6px_20px_-6px_rgba(0,0,0,0.5)]">
                    <Link
                      href={`/book/${data._id}`}
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl shadow-blue-600/30 hover:shadow-blue-700/40 active:scale-[0.98] group"
                    >
                      <span>Book This Billboard</span>
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}