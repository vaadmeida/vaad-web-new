/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/billboard/FilterSidebar.tsx
"use client";

import { useState, useMemo } from "react";
import FilterSection from "./FilterSection";
import Checkbox from "./Checkbox";
import { useAssets } from "@/app/hooks/useAssets";

interface FiltersType {
  mediaType: string;
  productType: string;
  location: string;
  serviceType?: string;
  minRate?: number;
  maxRate?: number;
}

interface FilterSidebarProps {
  onFilterChange: any;
  filters: FiltersType;
  assets?: any;
}

// Generate consistent counts for landmarks
const generateConsistentCount = (landmark: string): number => {
  let hash = 0;
  for (let i = 0; i < landmark.length; i++) {
    hash = ((hash << 5) - hash) + landmark.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 290) + 10;
};

const FilterSidebar = ({ onFilterChange, filters, assets }: FilterSidebarProps) => {
  const { assets: assetsData } = useAssets();
  const [billboardTypeSearch, setBillboardTypeSearch] = useState("");
  const [landmarkSearch, setLandmarkSearch] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [selectedLandmarks, setSelectedLandmarks] = useState<string[]>([]);

  // Get media types from assets
  const mediaTypes = useMemo(() => {
    if (assets?.mediaAndProductsTypes) {
      return Object.keys(assets.mediaAndProductsTypes);
    }
    if (assetsData?.mediaAndProductsTypes) {
      return Object.keys(assetsData.mediaAndProductsTypes);
    }
    return [];
  }, [assets, assetsData]);

  // Get landmarks from assets
  const landmarks = useMemo(() => {
    if (assets?.landmarks) return assets.landmarks;
    if (assetsData?.landmarks) return assetsData.landmarks;
    return [];
  }, [assets, assetsData]);

  // Generate consistent counts for landmarks
  const landmarkCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    landmarks.forEach((landmark: string) => {
      counts[landmark] = generateConsistentCount(landmark);
    });
    return counts;
  }, [landmarks]);

  // Filter media types based on search
  const filteredMediaTypes = useMemo(() => {
    if (!billboardTypeSearch) return mediaTypes;
    return mediaTypes.filter(type => 
      type.toLowerCase().includes(billboardTypeSearch.toLowerCase())
    );
  }, [mediaTypes, billboardTypeSearch]);

  // Filter landmarks based on search
  const filteredLandmarks = useMemo(() => {
    if (!landmarkSearch) return landmarks;
    return landmarks.filter((landmark: string) => 
      landmark.toLowerCase().includes(landmarkSearch.toLowerCase())
    );
  }, [landmarks, landmarkSearch]);

  // Price ranges
  const priceRanges = [
    { label: "₦0 - ₦200,000", min: 0, max: 200000 },
    { label: "₦200,000 - ₦500,000", min: 200000, max: 500000 },
    { label: "₦500,000 - ₦1,000,000", min: 500000, max: 1000000 },
    { label: "₦1,000,000 - ₦2,000,000", min: 1000000, max: 2000000 },
    { label: "₦2,000,000 - ₦5,000,000", min: 2000000, max: 5000000 },
    { label: "₦5,000,000+", min: 5000000, max: undefined },
  ];

  // Handle media type selection
  const handleMediaTypeChange = (mediaType: string, checked: boolean) => {
    if (checked) {
      onFilterChange("mediaType", mediaType);
    } else if (filters.mediaType === mediaType) {
      onFilterChange("mediaType", "");
    }
  };

  // Handle price range selection
  const handlePriceRangeChange = (range: typeof priceRanges[0], checked: boolean) => {
    if (checked) {
      setSelectedPriceRange(range.label);
      onFilterChange("minRate", range.min);
      onFilterChange("maxRate", range.max);
    } else {
      setSelectedPriceRange("");
      onFilterChange("minRate", undefined);
      onFilterChange("maxRate", undefined);
    }
  };

  // Handle landmark selection
  const handleLandmarkChange = (landmark: string, checked: boolean) => {
    if (checked) {
      setSelectedLandmarks([...selectedLandmarks, landmark]);
    } else {
      setSelectedLandmarks(selectedLandmarks.filter(l => l !== landmark));
    }
  };

  return (
    <aside className="space-y-6">
      {/* Billboard Type */}
      <FilterSection title="Billboard Type" searchable>
        <input
          type="text"
          placeholder="e.g. Static Billboard"
          value={billboardTypeSearch}
          onChange={(e) => setBillboardTypeSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-[#E0E0E0] rounded-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="space-y-2 mt-3 max-h-60 overflow-y-auto">
          {filteredMediaTypes.map((type) => (
            <Checkbox
              key={type}
              label={type}
              checked={filters.mediaType === type}
              onChange={(checked) => handleMediaTypeChange(type, checked)}
            />
          ))}
          {filteredMediaTypes.length === 0 && (
            <p className="text-sm text-gray-500">No billboard types found</p>
          )}
        </div>
      </FilterSection>

      {/* Pricing */}
      <FilterSection title="Pricing">
        {priceRanges.map((range) => (
          <Checkbox
            key={range.label}
            label={range.label}
            checked={selectedPriceRange === range.label}
            onChange={(checked) => handlePriceRangeChange(range, checked)}
          />
        ))}
      </FilterSection>

      {/* Landmark */}
      <FilterSection title="Landmark" searchable>
        <input
          type="text"
          placeholder="e.g School"
          value={landmarkSearch}
          onChange={(e) => setLandmarkSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-[#E0E0E0] rounded-sm outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredLandmarks.map((landmark: string) => (
            <Checkbox
              key={landmark}
              label={landmark}
              count={landmarkCounts[landmark]}
              checked={selectedLandmarks.includes(landmark)}
              onChange={(checked) => handleLandmarkChange(landmark, checked)}
            />
          ))}
          {filteredLandmarks.length === 0 && (
            <p className="text-sm text-gray-500">No landmarks found</p>
          )}
        </div>
      </FilterSection>
    </aside>
  );
};

export default FilterSidebar;