// app/components/sections/Hero.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Phone } from "lucide-react";

// Types
interface Filters {
  service: string;
  location: string;
  media: string;
}

export default function Hero() {
  const [filters, setFilters] = useState<Filters>({
    service: "Outdoor Advertising",
    location: "Lagos",
    media: "Led Billboard",
  });

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    console.log("Search Filters:", filters);
  };

  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* Header */}

      {/* Main Content */}
      <div className="relative h-screen flex pt-24">
        {/* Background GIF */}
        <div className="absolute inset-0">
          <Image
            src="/video/vaad-bg.gif"
            alt="VAAD Media Billboard"
            fill
            priority
            unoptimized // Important for GIFs
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto px-18 w-full">
          <div className="max-w-3xl">
            {/* Headline */}
            <h1 className="text-white text-[72px] font-bold leading-tight suez-one">
              Find It, Book It,
              <br />
              Go Live!
            </h1>

            {/* Subheadline */}
            <p className="text-[#FAF5ED] text-lg mt-4 max-w-xl font-normal">
              We connect brands to millions through high-impact billboards
              across Nigeria
            </p>
          </div>

          {/* Search Box */}
          <div className="mt-12 bg-white rounded-lg shadow-xl p-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Service Type */}
              <div>
                <label className="block text-[17.04px] text-[#333333] mb-2">
                  Select Service Type
                </label>
                <select
                  className="w-full px-3 py-2.5 bg-[#F8FBFD] rounded-[4.56px] text-[13.25px] focus:outline-none"
                  value={filters.service}
                  onChange={(e) =>
                    handleFilterChange("service", e.target.value)
                  }
                >
                  <option>Outdoor Advertising</option>
                  <option>Indoor Advertising</option>
                  <option>Digital Signage</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[17.04px] text-[#333333] mb-2">
                  Location
                </label>
                <select
                  className="w-full px-3 py-2.5 bg-[#F8FBFD] rounded-[4.56px] text-[13.25px] focus:outline-none"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                >
                  <option>Lagos</option>
                  <option>Abuja</option>
                  <option>Port Harcourt</option>
                  <option>Ibadan</option>
                  <option>Kano</option>
                </select>
              </div>

              {/* Media Type */}
              <div>
                <label className="block text-[17.04px] text-[#333333] mb-2">
                  Media Type
                </label>
                <select
                  className="w-full px-3 py-2.5 bg-[#F8FBFD] rounded-[4.56px] text-[13.25px] focus:outline-none"
                  value={filters.media}
                  onChange={(e) => handleFilterChange("media", e.target.value)}
                >
                  <option>Led Billboard</option>
                  <option>Static Billboard</option>
                  <option>Digital Screen</option>
                  <option>Gantry</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full bg-[#0177AB] hover:bg-[#007a9e] text-[14.58px] text-white font-bold py-[14.58px] px-[36.45px] rounded-[4.56px] transition-colors flex items-center justify-center gap-2"
                >
                  {/* <Search className="w-4 h-4" /> */}
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
