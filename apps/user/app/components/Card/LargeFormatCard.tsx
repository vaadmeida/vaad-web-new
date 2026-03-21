"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface LargeFormatCardProps {
  title: string;
  subtitle?: string;
  image: string;
  onClick?: () => void;
}

const LargeFormatCard = ({
  title,
  subtitle,
  image,
  onClick,
}: LargeFormatCardProps) => {
  return (
    <div
      className="relative w-full h-[360px] md:h-[420px] rounded-xl overflow-hidden group cursor-pointer"
      onClick={onClick}
    >
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-500" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
        <h2 className="text-white text-2xl md:text-[48px] font-semibold">
          {title}
        </h2>

        {subtitle && (
          <p className="text-white/80 text-sm mt-3 max-w-md leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* CTA */}
        <button className="mt-6 inline-flex items-center gap-2 bg-[#FAFAFA] text-[#EB5757] text-[15.82px] font-semibold px-5 py-[11.87px] rounded-md w-fit hover:bg-gray-100 transition">
          BOOK NOW
          <ArrowRight size={16} />
        </button>

        {/* Countdown */}
        <div className="flex items-center gap-6 mt-8 text-white">
          {[
            { label: "Days", value: "07" },
            { label: "Hours", value: "08" },
            { label: "Minutes", value: "04" },
            { label: "Seconds", value: "05" },
          ].map((item, i) => (
            <div key={i} className="text-left">
              <p className="text-[32px] font-semibold tracking-wide">
                {item.value}
              </p>
              <p className="text-base text-white mt-1">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LargeFormatCard;