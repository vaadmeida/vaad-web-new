"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface ConsultationCardProps {
  title: string;
  subtitle?: string;
  image?: string;
  onClick?: () => void;
}

const ConsultationCard = ({
  title,
  subtitle,
  image,
  onClick,
}: ConsultationCardProps) => {
  return (
    <div
      className="relative w-full min-h-[360px] rounded-[24px] overflow-hidden group cursor-pointer bg-[#0177AB] flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-6"
      onClick={onClick}
    >
      {/* Left Content */}
      <div className="flex flex-col justify-center max-w-xl z-10">
        <h2 className="text-white text-[32px] font-semibold leading-tight">
          {title}
        </h2>

        {subtitle && (
          <p className="text-white/80 text-sm md:text-base mt-3 max-w-md leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* CTA */}
        <button className="mt-8 inline-flex items-center gap-2 bg-white text-[#0177AB] sm:text-[16px] text-[3.5vw] font-semibold px-5 py-[11.87px] rounded-md w-fit hover:bg-gray-100 transition shrink-0">
          Partner with us
          {/* <ArrowRight size={18} /> */}
        </button>
      </div>

      {/* Right Map Image */}
      <div className="relative w-full md:w-1/2 h-[220px] md:h-full flex items-center justify-center shrink-0">
        <img
          src={image}
          alt="Map graphic"
          className="object-contain max-h-full w-auto transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  );
};

export default ConsultationCard;