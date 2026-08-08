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
  subtitle = "Reach commuters up close with targeted placements in high-footfall waiting areas.",
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

      <div className="max-w-7xl flex sm:flex-row flex-col gap-6 w-full">
        {/* LEFT LARGE CARD */}
        <div className="relative rounded-xl overflow-hidden h-[460px] w-full">
          <img
            src="/images/b1.jpg"
            alt="Promo"
            className="w-full h-full object-cover"
          />

          {/* Faded Bottom Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

          {/* Content at Bottom */}
          <div className="absolute bottom-0 inset-x-0 p-7 flex justify-between text-white w-full items-center z-10">
            <h3 className="text-2xl font-bold leading-snug">
              Ikeja Along Train Zone
            </h3>

            <button className="bg-[#0177AB] hover:bg-[#015f8a] px-5 py-2 rounded-md text-sm font-medium shrink-0">
              Book now
            </button>
          </div>
        </div>

        {/* RIGHT GRID */}
        <div className="relative rounded-xl overflow-hidden h-[460px] w-full">
          <img
            src="/images/b2.jpg"
            alt="Promo"
            className="w-full h-full object-cover"
          />

          {/* Badge */}
          <div className="absolute top-4 left-4 bg-[#E7F8F2] font-semibold text-[#0B835C] text-xs px-3 py-1 rounded-full z-10">
            UP TO 50% OFF
          </div>

          {/* Faded Bottom Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

          {/* Content at Bottom */}
          <div className="absolute bottom-0 inset-x-0 p-7 flex justify-between text-white w-full items-center z-10">
            <h3 className="text-2xl font-bold leading-snug whitespace-pre-line">
              Free Trade{"\n"}Commuters Zone
            </h3>

            <button className="bg-[#0177AB] hover:bg-[#015f8a] px-5 py-2 rounded-md text-sm font-medium shrink-0">
              Book now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}