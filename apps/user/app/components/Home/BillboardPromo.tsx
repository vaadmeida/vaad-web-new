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

export default function BillboardPromoSection({
  title = "Transit Advertising",
  subtitle = "Take your brand on the move and connect with audiences throughout their daily commute.",
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
      
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 group">
        {/* LEFT LARGE CARD */}
        <div className="relative rounded-xl h-[390px] overflow-hidden">
  <img
    src="/images/t1.jpg"
    alt="Promo"
    className="w-full h-full object-cover rounded-xl"
  />

  {/* Faded Bottom Overlay */}
  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

  {/* Content */}
  <div className="absolute bottom-6 left-6 right-6 text-white max-w-[400px]">
    <h3 className="text-[32px] font-semibold leading-snug">
      Put your brand in front of commuters every day.
    </h3>
    <p className="text-[16px] text-white mt-2">
      Seen by thousands of riders and pedestrians on every route.
    </p>

    <button className="mt-4 bg-[#0177AB] hover:bg-[#015f8a] px-5 py-2 rounded-md text-sm font-medium">
      Book Now
    </button>
  </div>
</div>

          {/* TOP RIGHT */}
          <div className="relative rounded-xl h-[390px]">
            <img
              src="/images/t2.jpg"
              alt="Promo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

            <div className="relative rounded-xl h-[390px]">
            <img
              src="/images/t3.jpg"
              alt="Promo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* BOTTOM RIGHT */}
          <div className="relative rounded-xl h-[390px]">
            <img
              src="/images/t4.jpg"
              alt="Promo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>



      </div>
    </section>
  );
}
