// DealCard.tsx
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";

interface DealCardProps {
  title: string;
  image: string;
  available: number;
  location?: string;
  state?: string;
}

const DealCard = ({ title, image, available, location, state }: DealCardProps) => {
  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative w-full h-102.25 rounded-xl overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover transition-transform duration-500 group-hover:scale-105 w-full h-full"
        />
        
        {/* Hot Deal Badge */}
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          HOT DEAL
        </div>
      </div>

      {/* Content */}
      <div className="flex items-start justify-between mt-4 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="sm:text-[18px] text-[5vw] font-bold text-[#2A2F2F] truncate">
            {title}
          </h3>
          
          {/* Location if available */}
          {(location || state) && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-[#7F7F7F] shrink-0" />
              <p className="sm:text-[12px] text-[3vw] text-[#7F7F7F] truncate">
                {location}{state ? `, ${state}` : ""}
              </p>
            </div>
          )}
          
          <p className="sm:text-[14px] text-[3.5vw] text-[#7F7F7F] font-normal mt-1">
            {typeof available === 'number' && available > 1000 
              ? formatPrice(available)
              : `${available.toLocaleString()} available`
            }
          </p>
        </div>

        <ArrowRight
          size={18}
          className="text-gray-400 group-hover:translate-x-1 transition-transform duration-300 shrink-0 mt-1"
        />
      </div>
    </div>
  );
};

export default DealCard;