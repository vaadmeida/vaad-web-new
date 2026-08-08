// DealCard.tsx
import React from "react";
import { MapPin } from "lucide-react";

interface DealCardProps {
  title: string;
  image: string;
  available: number;
  location?: string;
  state?: string;
}

const DealCard = ({
  title,
  image,
  available,
  location,
  state,
}: DealCardProps) => {
  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="relative rounded-xl overflow-hidden h-115 w-full group cursor-pointer">
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Faded Bottom Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

      {/* Content at Bottom */}
      <div className="absolute bottom-0 inset-x-0 p-5 flex justify-between text-white w-full items-center z-10 gap-4">
        <div className="min-w-0 flex-1">
          {/* Title */}
          <h3 className="text-[18px] font-semibold leading-snug line-clamp-2">
            {title}
          </h3>

          {/* Available Badge (Under Title) */}
          <div className="inline-block mt-2 bg-[#E7F8F2] font-semibold text-[#0B835C] text-xs px-3 py-1 rounded-full">
            Available
          </div>

      
        </div>

        <button className="bg-[#0177AB] hover:bg-[#015f8a] px-3 py-2 rounded-md text-sm font-medium shrink-0 transition-colors">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DealCard;