"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/Home/Footer";
import SimilarMedia from "@/app/components/SimilarMedia";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const dummy = {
  id: "1",
  title: "Backlit Billboard At 2nd Toll Gate",
  price: 129.99,
  location: "Lekki-Epe Express Way, Lagos",
  image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
  thumbnails: [
    "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
    "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9",
    "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  ],
};

export default function BillboardDetailsPage() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(dummy.image);

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
            <Link className='underline-none' href={"/billboard"}>Billboard</Link> <span className="text-[#667185]">/</span> LED Billboard <span className="text-[#667185]">/</span>{" "}
            <span className="text-[#667185]">{dummy.title}</span>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT - Images */}
            <div>
              {/* Main Image */}
              <div className="relative w-full h-[350px] md:h-[696] rounded-[10px] overflow-hidden">
                <Image
                  src={activeImage}
                  alt="billboard"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Thumbnails */}
              <div className="flex flex-wrap gap-3 mt-4">
                {dummy.thumbnails.map((img, i) => (
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
            </div>

            {/* RIGHT - Details */}
            <div className="flex flex-col gap-4">
              {/* Title */}
              <h1 className="text-[22px] md:text-[26px] font-semibold text-[#101928">
                {dummy.title}
              </h1>

              {/* Description */}
              <p className="text-sm text-[#667185] leading-relaxed">
                This premium backlit billboard is strategically positioned at
                the 2nd Toll Gate, one of the busiest traffic corridors along
                the Lekki-Epe Expressway. It offers exceptional visibility to
                both inbound and outbound traffic.
              </p>

              {/* Price */}
              <div className="text-[24px] font-bold text-[#101928] leading-tight">
                ₦{dummy.price}/month
              </div>

              {/* Location */}
              <p className="text-sm text-[#667185]">{dummy.location}</p>

              {/* Features */}
              <div className="mt-3">
                <h3 className="font-semibold text-[#101928] mb-2">
                  Media Features
                </h3>
                <ul className="text-sm text-[#101928] space-y-3">
                  <li>• Type: Backlit Static Billboard</li>
                  <li>• Size: 18ft x 48ft (Large)</li>
                  <li>• Estimated 300,000+ daily impressions</li>
                  <li>• High traffic audience reach</li>
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
                    Will be available in <span className='text-[#E8505B]'>12 days</span> Left!
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button className="bg-[#0177AB] text-white px-10 py-4 rounded-lg text-[16px] font-semibold">
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
