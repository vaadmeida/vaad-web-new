import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Calendar } from "lucide-react";

interface BillboardCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  state: string;
  price: number;
  originalPrice?: number;
  availableIn: number;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export default function BillboardCard({
  id,
  title,
  category,
  location,
  state,
  price,
  originalPrice,
  availableIn,
  rating,
  reviewCount,
  imageUrl = "/billboard-placeholder.jpg",
  onBookmark,
  isBookmarked = false,
  description
}: BillboardCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="group bg-transparent rounded-t-[7.75px] border-b border-[#C1C4D6] overflow-hidden transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden rounded-[7.75px]">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-[7.75px]"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-[#0177AB] backdrop-blur-sm px-[13.57px] py-[2.91px] font-medium rounded-[3.88px] text-xs text-white">
          {category}
        </div>

        {/* Bookmark Button */}
        {onBookmark && (
          <button
            onClick={onBookmark}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <svg
              className={`w-4 h-4 ${isBookmarked ? 'fill-[#0088b5] text-[#0088b5]' : 'text-gray-600'}`}
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-[#0177AB] text-[#0177AB]" />
            <span className="text-[15.5px] font-medium text-gray-900 ml-0.5">{rating}</span>
          </div>
          <span className="text-xs text-gray-500">({reviewCount.toLocaleString()} reviews)</span>
        </div>

        {/* Title */}
        <h3 className="text-[21.32px] font-semibold text-[#0177AB] mb-1 line-clamp-1">{title}</h3>
        
        {/* Category Type */}
        {/* <p className="text-sm text-gray-600 mb-2">{category}</p> */}
        <p className="text-[15.5px] text-[#333333] mb-4 font-normal">{description}</p>

        {/* Location */}
        <div className="flex items-start gap-2 mb-4">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[13.57px] font-normal text-[#696F8C]">{location}, {state}</p>
          </div>
        </div>

       <div className="flex gap-7 items-center">
         {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-[31.01px] font-bold text-[#333333]">₦{price.toLocaleString()}</span>
          {originalPrice && (
            <>
              <span className="text-[16.47px] text-[#696F8C] line-through font-medium">₦{originalPrice.toLocaleString()}</span>
              {/* <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                -{discount}%
              </span> */}
            </>
          )}
        </div>

        <Link
          href=''
          className="w-full block text-center bg-[#F5F9FC] text-[#0177AB] font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-[13.57px]"
        >
          Available in <span>{availableIn} days</span>
        </Link>
       </div>

        {/* Availability */}
        {/* <div className="flex items-center gap-2 text-sm text-gray-600 border-t border-gray-100 pt-3">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Available in <span className="font-medium text-gray-900">{availableIn} days</span></span>
        </div> */}

        

        {/* View Details Button */}
        {/* <Link
          href={`/billboard/${id}`}
          className="mt-4 w-full block text-center bg-gray-50 hover:bg-[#0088b5] text-gray-700 hover:text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm"
        >
          View Details
        </Link> */}
      </div>
    </div>
  );
}