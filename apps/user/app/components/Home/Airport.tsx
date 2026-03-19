// app/components/sections/BillboardSection.tsx
import BillboardCard from "@/app/components/billboard/BillboardCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

// Sample data - replace with actual data from your API
const BILLBOARDS = [
  {
    id: "1",
    title: "Static Billboards",
    category: "Static Billboards",
    description: "Tall, single-column boards designed for maximum distance visibility on highways and busy intersections.",
    location: "Arochukwu",
    state: "Abia",
    price: 780,
    originalPrice: 980,
    availableIn: 12,
    rating: 4.9,
    reviewCount: 280,
    imageUrl: "https://www.risingabovethenoise.com/wp-content/uploads/2025/05/Chew-Chew-Billboard-2025-scaled.jpg",
  },
  {
    id: "2",
    title: "LED Billboards",
    category: "LED Billboards",
    description: "Massive ads that dominate building facades — ideal for premium brands and impactful urban storytelling.",
    location: "Jimeta",
    state: "Adamawa",
    price: 780,
    originalPrice: 980,
    availableIn: 41,
    rating: 4.9,
    reviewCount: 280,
    imageUrl: "https://www.risingabovethenoise.com/wp-content/uploads/2025/05/Chew-Chew-Billboard-2025-scaled.jpg",
  },
  {
    id: "3",
    title: "Billboard",
    category: "Billboard",
    description: "Street-level banners that line major roads, perfect for localized visibility and city-wide brand awareness.",
    location: "Ikot Ekpene",
    state: "Akwa Ibom",
    price: 620,
    originalPrice: 980,
    availableIn: 8,
    rating: 4.7,
    reviewCount: 340,
    imageUrl: "https://www.risingabovethenoise.com/wp-content/uploads/2025/05/Chew-Chew-Billboard-2025-scaled.jpg",
  },
  {
    id: "4",
    title: "Digital Billboards",
    category: "Digital Billboards",
    description: "High-impact digital displays with rotating ads for maximum exposure in prime locations.",
    location: "Victoria Island",
    state: "Lagos",
    price: 1200,
    originalPrice: 1500,
    availableIn: 5,
    rating: 4.8,
    reviewCount: 420,
    imageUrl: "https://www.risingabovethenoise.com/wp-content/uploads/2025/05/Chew-Chew-Billboard-2025-scaled.jpg",
  },
  {
    id: "5",
    title: "Gantry Signs",
    category: "Gantry Signs",
    description: "Large format signs spanning across highways, perfect for major brand campaigns.",
    location: "Central Area",
    state: "Abuja",
    price: 890,
    originalPrice: 1100,
    availableIn: 15,
    rating: 4.6,
    reviewCount: 195,
    imageUrl: "https://www.risingabovethenoise.com/wp-content/uploads/2025/05/Chew-Chew-Billboard-2025-scaled.jpg",
  },
  {
    id: "6",
    title: "Bridge Panels",
    category: "Bridge Panels",
    description: "High-visibility panels on pedestrian bridges targeting both foot and vehicular traffic.",
    location: "Ikeja",
    state: "Lagos",
    price: 550,
    originalPrice: 750,
    availableIn: 3,
    rating: 4.5,
    reviewCount: 167,
    imageUrl: "https://www.risingabovethenoise.com/wp-content/uploads/2025/05/Chew-Chew-Billboard-2025-scaled.jpg",
  },
];

interface BillboardSectionProps {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  limit?: number;
}

export default function AirportSection({ 
  title = "Airport Advertising", 
  subtitle = "From idea to installation - we make outdoor advertising easy, measurable, and unforgettable.",
  showViewAll = false,
  limit = 3 
}: BillboardSectionProps) {
  
  const displayedBillboards = BILLBOARDS.slice(0, limit);

  return (
    <section className="p-18 bg-white">
      <div className="mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D0A19] mb-3">
              {title}
            </h2>
            <p className="text-[#333333] max-w-[500px] font-normal text-[17.44px]">
              {subtitle}
            </p>
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

        {/* Billboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBillboards.map((billboard) => (
            <BillboardCard
              key={billboard.id}
              {...billboard}
            />
          ))}
        </div>

        {/* View More on Mobile (if needed) */}
        {showViewAll && (
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/billboards"
              className="inline-flex items-center justify-center gap-2 text-[#0088b5] font-medium"
            >
              View All Billboards
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}