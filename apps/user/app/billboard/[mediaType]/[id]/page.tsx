/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/Home/Footer";
import SimilarMedia from "@/app/components/SimilarMedia";
import { Minus, Plus, Share2, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { billboardService, Billboard } from "@/app/lib/billboard/billboard-service";

export default function BillboardDetailsPage() {
  const params = useParams();
  const { mediaType, city, id } = params;
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [billboard, setBillboard] = useState<Billboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    const fetchBillboard = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await billboardService.getBillboardById(id as string);
        setBillboard(data);
        if (data.photos?.[0] || data.images?.[0]) {
          setActiveImage(data.photos?.[0] || data.images?.[0] || "");
        }
      } catch (err) {
        console.error("Failed to fetch billboard:", err);
        setError("Failed to load billboard details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBillboard();
  }, [id]);

  // Calculate available days
  const calculateAvailableDays = () => {
    if (!billboard?.availableDate) return 0;
    try {
      const available = new Date(billboard.availableDate);
      const today = new Date();
      const diffTime = available.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return 0;
    }
  };

  const availableIn = calculateAvailableDays();
  const allImages = billboard?.photos?.length ? billboard.photos : (billboard?.images?.length ? billboard.images : []);

  // Copy to clipboard function
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopiedTooltip(true);
      setTimeout(() => setShowCopiedTooltip(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Share function
// Replace the handleShare function with this corrected version:

const handleShare = async () => {
  try {
    // Check if Web Share API is available (not just defined)
    if (typeof navigator.share === 'function') {
      await navigator.share({
        title: billboard?.mediaType || "Billboard",
        text: `Check out this ${billboard?.mediaType} at ${billboard?.locationAddress}`,
        url: window.location.href,
      });
    } else {
      // Fallback to copy
      await navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  } catch (err) {
    console.error("Failed to share:", err);
    // Fallback to copy if share fails
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    } catch (copyErr) {
      console.error("Failed to copy:", copyErr);
    }
  }
};

  if (isLoading) {
    return (
      <>
        <div className="bg-[#F7F9FC] min-h-screen">
          <div className="fixed top-0 left-0 right-0 z-50">
            <Navbar transparent />
          </div>
          <section className="bg-linear-to-r from-[#0177AB] to-[#003045] pt-24 pb-20 px-4 lg:px-16" />
          <section className="bg-white px-4 sm:px-18 py-10">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="h-[400px] bg-gray-200 rounded"></div>
                  <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <SimilarMedia />
        <Footer />
      </>
    );
  }

  if (error || !billboard) {
    return (
      <>
        <div className="bg-[#F7F9FC] min-h-screen">
          <div className="fixed top-0 left-0 right-0 z-50">
            <Navbar transparent />
          </div>
          <section className="bg-linear-to-r from-[#0177AB] to-[#003045] pt-24 pb-20 px-4 lg:px-16" />
          <section className="bg-white px-4 sm:px-18 py-10">
            <div className="max-w-7xl mx-auto text-center py-20">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Billboard Not Found</h2>
              <p className="text-gray-500 mb-6">{error || "The billboard you're looking for doesn't exist."}</p>
              <Link href="/" className="bg-[#0177AB] text-white px-6 py-3 rounded-lg hover:bg-[#006d91] transition">
                Go Back Home
              </Link>
            </div>
          </section>
        </div>
        <SimilarMedia />
        <Footer />
      </>
    );
  }

  // Format display values
  const displayMediaType = billboard.mediaType?.toLowerCase().replace(/-/g, " ") || "Billboard";
  const displayCity = billboard.city?.toLowerCase().replace(/-/g, " ") || "location";

  return (
    <>
      <div className="bg-[#F7F9FC] min-h-screen">
        {/* Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar transparent />
        </div>

        {/* Header */}
        <section className="bg-linear-to-r from-[#0177AB] to-[#003045] pt-24 pb-20 px-4 lg:px-16" />

        {/* Main */}
        <section className="bg-white px-4 sm:px-18 py-10">
          <div className="text-[#EB5017] text-sm font-medium pb-10">
            <Link href="/">Home</Link> <span className="text-[#667185]">/</span>{" "}
            <Link href="/billboard">Billboard</Link> <span className="text-[#667185]">/</span>{" "}
            <span className="capitalize text-[#667185]">{displayMediaType}</span>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT - Images */}
            <div>
              {/* Main Image */}
              <div className="relative w-full h-[350px] md:h-[500px] rounded-[10px] overflow-hidden">
                <Image
                  src={activeImage || allImages[0] || "/billboard-placeholder.jpg"}
                  alt={billboard.mediaType || "Billboard"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {allImages.map((img: any, i: any) => (
                    <div
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-[122px] h-[120px] rounded-[10px] overflow-hidden cursor-pointer border ${
                        activeImage === img
                          ? "border-2 border-[#0177AB]"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT - Details */}
            <div className="flex flex-col gap-4">
              {/* Title with Share and Copy Icons */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-[22px] md:text-[26px] font-semibold text-[#101928] capitalize flex-1">
                  {billboard.mediaType} At {billboard.locationAddress}
                </h1>
                
                {/* Share & Copy Buttons */}
                <div className="flex gap-2">
                  {/* Copy Link Button */}
                  <div className="relative">
                    <button
                      onClick={handleCopyLink}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
                      aria-label="Copy link"
                    >
                      <Copy size={18} className="text-gray-500 group-hover:text-[#0177AB] transition-colors" />
                    </button>
                    {showCopiedTooltip && (
                      <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                        Link copied!
                      </div>
                    )}
                  </div>

                  {/* Share Button */}
                  <div className="relative">
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
                      aria-label="Share"
                    >
                      <Share2 size={18} className="text-gray-500 group-hover:text-[#0177AB] transition-colors" />
                    </button>
                    {/* {showShareTooltip && (
                      <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                        {await navigator.share() ? "Share dialog opened" : "Link copied!"}
                      </div>
                    )} */}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#667185] leading-relaxed">
                {billboard.description || `This premium ${billboard.mediaType} is strategically positioned at ${billboard.locationAddress}, ${billboard.city}. It offers exceptional visibility with ${billboard.height}ft x ${billboard.width}ft format.`}
              </p>

              {/* Price */}
              <div className="text-[24px] font-bold text-[#101928] leading-tight">
                ₦{billboard.rate?.toLocaleString()}/month
              </div>

              {/* Location */}
              <p className="text-sm text-[#667185]">{billboard.locationAddress}, {billboard.city}, {billboard.state}</p>

              {/* Features */}
              <div className="mt-3">
                <h3 className="font-semibold text-[#101928] mb-2">Media Features</h3>
                <ul className="text-sm text-[#101928] space-y-3">
                  <li>• Type: {billboard.mediaType}</li>
                  <li>• Size: {billboard.height}ft x {billboard.width}ft ({billboard.units})</li>
                  <li>• Service Type: {billboard.serviceType}</li>
                  {billboard.printProductType && <li>• Print Material: {billboard.printProductType}</li>}
                </ul>
              </div>

              {/* Quantity */}
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Quantity</p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-[#F9FAFB] border border-[#F0F2F5] rounded-full px-3 py-1 gap-3">
                    <button
                      onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                    >
                      <Minus size={16} />
                    </button>

                    <span className="text-[16px] font-medium text-[#E8505B]">
                      {quantity}{" "}
                      <span className="text-[14px] font-light">
                        Month{quantity > 1 ? "s" : ""}
                      </span>
                    </span>

                    <button onClick={() => setQuantity((q) => q + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>

                  <span className="text-xs text-gray-500">
                    Will be available in <span className='text-[#E8505B]'>{availableIn} days</span> Left!
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button className="bg-[#0177AB] text-white px-10 py-4 rounded-lg text-[16px] font-semibold hover:bg-[#006d91] transition">
                  Buy Now
                </button>

                <button className="border border-[#0177AB] px-10 py-4 rounded-lg text-[#0177AB] hover:bg-[#0178ab0f] text-[16px] font-semibold">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <SimilarMedia />
      <Footer />
    </>
  );
}