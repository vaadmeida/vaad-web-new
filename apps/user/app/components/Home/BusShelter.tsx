"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import SectionHeader from "../SectionHeader";

interface BillboardSectionProps {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  limit?: number;
}

export default function BusShelterSection({
  title = "Bus Shelter Advertising",
  subtitle = "",
  showViewAll = true,
  limit = 3,
}: BillboardSectionProps) {
  return (
    <section className="sm:p-18 px-5 py-14 bg-white">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        showViewAll={showViewAll}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT LARGE CARD */}
        <div className="relative rounded-2xl overflow-hidden h-[546.875px] group">
          <img
            src="/images/bus-shelter.jpg"
            alt="Promo"
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          {/* <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" /> */}

          {/* Badge */}
          <div className="absolute top-4 left-4 border border-[#0177AB] bg-transparent font-semibold text-[#F3A218] text-xs px-3 py-1 rounded-full">
            UP TO 80% OFF
          </div>

          {/* Content */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h3 className="text-2xl font-bold leading-snug">
              Free Delivery on all dresses ordered until November 30
            </h3>
            <p className="text-sm text-gray-200 mt-2">
              All the sleekest dress for you to twin with your girlfriends.
            </p>

            <button className="mt-4 bg-[#0177AB] hover:bg-[#015f8a] px-5 py-2 rounded-md text-sm font-medium">
              Book now →
            </button>
          </div>
        </div>

        {/* RIGHT GRID */}
        <div className="sm:grid grid-rows-2 gap-6 h-[546.875px] hidden">
          {/* TOP RIGHT */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img
              src="/images/bus-shelter-2.jpg"
              alt="Promo"
              className="w-full h-full object-cover"
            />
            {/* <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" /> */}
          </div>

          {/* BOTTOM RIGHT */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img
              src="/images/bus-shelter-3.jpg"
              alt="Promo"
              className="w-full h-full object-cover"
            />
            {/* <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" /> */}
          </div>
        </div>
      </div>
    </section>
  );
}
