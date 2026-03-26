import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface DealCardProps {
  title: string;
  image: string;
  available: number;
}

const DealCard = ({ title, image, available }: DealCardProps) => {
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative w-full h-102.25 rounded-xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <h3 className="sm:text-[18px] text-[5vw] font-bold text-[#2A2F2F]">
            {title}
          </h3>
          <p className="sm:text-[14px] text-[3.5vw] text-[#7F7F7F] font-normal mt-1">
            {available.toLocaleString()} available
          </p>
        </div>

        <ArrowRight
          size={18}
          className="text-gray-400 group-hover:translate-x-1 transition-transform duration-300"
        />
      </div>
    </div>
  );
};

export default DealCard;