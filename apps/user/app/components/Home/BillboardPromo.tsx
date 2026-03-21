"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface BillboardSectionProps {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  limit?: number;
}

export default function BillboardPromoSection({
  title = "Transit Advertising",
  subtitle = "",
  showViewAll = true,
  limit = 3,
}: BillboardSectionProps) {
  return (
    <section className="w-full bg-white p-18">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0D0A19] mb-3">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl">{subtitle}</p>
        </div>

        {showViewAll && (
          <Link
            href="/billboards"
            className="inline-flex underline underline-offset-4 items-center gap-2 text-[#0D0A19] hover:text-[#0177AB] font-medium text-[17.44px] mt-4 md:mt-0 group"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT LARGE CARD */}
        <div className="relative rounded-2xl overflow-hidden h-[789px] group">
          <img
            src="/images/transit.jpg"
            alt="Promo"
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />

          {/* Badge */}
          <div className="absolute top-4 left-4 bg-[#0177AB] text-white text-xs px-3 py-1 rounded-full">
            WORLD BILLBOARD DAY
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
        <div className="grid grid-rows-2 gap-6 h-[789px]">
          {/* TOP RIGHT */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img
              src="/images/transit-2.png"
              alt="Promo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
          </div>

          {/* BOTTOM RIGHT */}
          <div className="relative rounded-2xl overflow-hidden group">
            <img
              src="/images/transit-3.png"
              alt="Promo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
          </div>
        </div>
      </div>
    </section>
  );
}
