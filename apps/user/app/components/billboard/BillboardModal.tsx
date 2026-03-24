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
  Heart,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Share2,
  Maximize2,
  Calendar,
  ArrowRight,
  Sparkles,
  Shield,
  Headphones,
  ThumbsUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorite } from "@/app/contexts/favorite-context";

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
  specifications?: { height?: number; width?: number };
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
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
  } catch {
    return 0;
  }
};

export default function BillboardModal({ billboard, isOpen, onClose }: BillboardModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageDirection, setImageDirection] = useState(0);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'features' | 'audience'>('details');

  const modalRef = useRef<HTMLDivElement>(null);
  const { toggleFavorite, isFavorite } = useFavorite();

  // Set mounted after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Data Normalization - computed after mount to avoid hydration mismatch
  const data = (() => {
    if (!billboard) return null;
    return {
      _id: billboard._id,
      mediaType: billboard.mediaType || "Billboard",
      locationAddress: billboard.locationAddress || billboard.location || "Prime Location",
      state: billboard.state || "Lagos",
      city: billboard.city || "",
      rate: billboard.rate || 0,
      images: billboard.photos?.length ? billboard.photos : billboard.images?.length ? billboard.images : ["/billboard-placeholder.jpg"],
      rating: billboard.rating || 4.5,
      reviews: billboard.reviews || 150,
      impressions: billboard.impressions || 10000,
      height: billboard.height || billboard.specifications?.height || 12,
      width: billboard.width || billboard.specifications?.width || 24,
      units: billboard.units || "meters",
      orientation: billboard.orientation || "landscape",
      landmark: billboard.landmark,
      serviceType: billboard.serviceType || "Outdoor Advertising",
      features: billboard.features || [],
      targetAudience: Array.isArray(billboard.targetAudience) ? billboard.targetAudience : 
                     typeof billboard.targetAudience === "string" ? [billboard.targetAudience] : 
                     ["Mass Market Consumers", "Urban Professionals", "Commuters"],
      locationString: (billboard.landmark ? `${billboard.locationAddress}, ${billboard.landmark}` : billboard.locationAddress || "Prime Location") + 
                     (billboard.city ? `, ${billboard.city}` : "") + `, ${billboard.state || "Lagos"}`,
      availableDate: billboard.availableDate,
      description: billboard.description,
    };
  })();

  const isFavorited = data && mounted ? isFavorite(data._id) : false;
  const daysUntilAvailable = calculateAvailableDays(data?.availableDate);
  const isAvailable = daysUntilAvailable === 0;

  // Image Navigation
  const handleNextImage = useCallback(() => {
    if (!data) return;
    setImageDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % data.images.length);
    setIsImageLoading(true);
  }, [data]);

  const handlePrevImage = useCallback(() => {
    if (!data) return;
    setImageDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + data.images.length) % data.images.length);
    setIsImageLoading(true);
  }, [data]);

  // Keyboard Navigation
  useEffect(() => {
    if (!isOpen || !mounted) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, mounted, onClose, handlePrevImage, handleNextImage]);

  // Body Scroll Lock
  useEffect(() => {
    if (!mounted) return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => modalRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, mounted]);

  const handleShare = useCallback(async () => {
    if (!data) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${data.mediaType} Billboard`, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareTooltip(true);
        setTimeout(() => setShowShareTooltip(false), 2000);
      }
    } catch {}
  }, [data]);

  const handleFavoriteToggle = useCallback(async () => {
    if (!data || isUpdating || !mounted) return;
    setIsUpdating(true);
    try {
      await toggleFavorite(data._id);
    } finally {
      setIsUpdating(false);
    }
  }, [data, toggleFavorite, isUpdating, mounted]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted || !isOpen || !data) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        
        {/* Modal */}
        <div
          ref={modalRef}
          className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero Section with Image */}
          <div className="relative h-[55vh] lg:h-[65vh] w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            
            <img
              src={data.images[currentImageIndex]}
              alt={data.mediaType}
              className="w-full h-full object-cover"
              onLoad={() => setIsImageLoading(false)}
            />

            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Image Navigation */}
            {data.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
                >
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
                >
                  <ChevronRight size={20} className="text-white" />
                </button>
              </>
            )}

            {/* Top Bar */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between">
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-medium">
                  {data.mediaType}
                </span>
                <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-medium flex items-center gap-1">
                  <Sparkles size={12} />
                  Premium
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition"
                >
                  <Share2 size={14} className="text-white" />
                </button>
                <button
                  onClick={handleFavoriteToggle}
                  className="w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition"
                >
                  <Heart size={14} className={isFavorited ? "fill-red-500 text-red-500" : "text-white"} />
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black to-transparent">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-semibold">{data.rating}</span>
                  <span className="text-white/70 text-sm">({data.reviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={14} className="text-white/70" />
                  <span className="text-white/70 text-sm">{formatNumber(data.impressions)}/day</span>
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">{data.mediaType}</h2>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <MapPin size={14} />
                <span>{data.locationString}</span>
              </div>
            </div>

            {/* Image Counter */}
            {data.images.length > 1 && (
              <div className="absolute bottom-4 right-4 z-20 px-2 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-xs">
                {currentImageIndex + 1}/{data.images.length}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 lg:p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Left Column - Info */}
              <div>
                {/* Price Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">₦{data.rate.toLocaleString()}</span>
                    <span className="text-gray-500">/day</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                    <CheckCircle2 size={14} />
                    <span>Instant booking • No upfront payment</span>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-5">
                  {[
                    { id: 'details' as const, label: 'Details', icon: Ruler },
                    { id: 'features' as const, label: 'Features', icon: TrendingUp },
                    { id: 'audience' as const, label: 'Audience', icon: Users },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-2 text-sm font-medium transition-colors relative ${
                        activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <tab.icon size={14} />
                        {tab.label}
                      </div>
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Ruler size={16} className="text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-500">Size</p>
                          <p className="text-sm font-medium">{data.height}m × {data.width}m</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Calendar size={16} className="text-purple-500" />
                        <div>
                          <p className="text-xs text-gray-500">Available</p>
                          <p className="text-sm font-medium">{isAvailable ? "Now" : `${daysUntilAvailable} days`}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {data.description || `Premium ${data.mediaType} location in ${data.locationString}. High-traffic area with excellent visibility for maximum brand exposure.`}
                    </p>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {data.features.length > 0 ? data.features.slice(0, 8).map((f, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">{f}</span>
                      )) : (
                        <>
                          <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm">High Visibility</span>
                          <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm">Prime Location</span>
                          <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm">24/7 Lighting</span>
                          <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm">Easy Access</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'audience' && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {data.targetAudience.map((audience, i) => (
                        <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                          <Users size={12} />
                          {audience}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Booking & Trust */}
              <div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield size={18} className="text-green-500" />
                    Why book with VAAD?
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Verified partners</div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> 24/7 support team</div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Free campaign consultation</div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> No hidden fees</div>
                  </div>
                </div>

                <Link
                  href={`/book/${data._id}`}
                  className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  Book This Billboard
                </Link>

                <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-400">
                  <div className="flex items-center gap-1"><Shield size={12} /> Secure</div>
                  <div className="flex items-center gap-1"><Headphones size={12} /> Support</div>
                  <div className="flex items-center gap-1"><ThumbsUp size={12} /> Guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}