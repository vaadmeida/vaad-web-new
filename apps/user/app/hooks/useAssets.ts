/* eslint-disable @typescript-eslint/no-explicit-any */
// app/hooks/useAssets.ts
import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/app/lib/api/client";

// New interface: Media Type -> Product Types mapping
interface MediaTypeData {
  [mediaType: string]: string[];
}

interface AssetsData {
  mediaTypeData: MediaTypeData; // Changed from flat arrays to nested structure
  statesAndCites: Record<string, string[]>;
}

export function useAssets() {
  const [assets, setAssets] = useState<AssetsData>({
    mediaTypeData: {},
    statesAndCites: {},
  });
  const [locations, setLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<any>("/billboards/assets");
      
      // New API structure: mediaType is now an object with nested product types
      const mediaTypeData: MediaTypeData = response.mediaType || {};
      const statesAndCites = response.statesAndCites || {};
      
      // Flatten all cities from statesAndCites for location dropdown
      const allLocations: string[] = [];
      Object.values(statesAndCites).forEach((cities: any) => {
        if (Array.isArray(cities)) {
          allLocations.push(...cities);
        }
      });
      
      setAssets({ mediaTypeData, statesAndCites });
      setLocations(allLocations);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
      setError(err instanceof Error ? err.message : "Failed to load filter options");
      
      // Fallback to default values if API fails
      setAssets({
        mediaTypeData: {
          "LED Billboard": ["Premium LED", "Standard LED", "Digital Display"],
          "Static Billboard": ["Large Format", "Medium Format", "Street Furniture"],
          "Digital Screen": ["Shopping Mall", "Transit", "Street"],
          "Gantry": ["Highway Gantry", "Bridge Gantry"],
          "Wall Wrap": ["Building Wrap", "Construction Hoarding"],
        },
        statesAndCites: {
          "Lagos": ["Lagos Island", "Ikeja", "Lekki", "Victoria Island", "Yaba"],
          "Abuja": ["Central Business District", "Wuse", "Maitama", "Garki"],
          "Port Harcourt": ["Old GRA", "Trans Amadi", "Rumukrushi"],
        },
      });
      setLocations(["Lagos Island", "Ikeja", "Lekki", "Victoria Island", "Central Business District", "Wuse"]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Helper to get all media types
  const getMediaTypes = useCallback(() => {
    return Object.keys(assets.mediaTypeData);
  }, [assets.mediaTypeData]);

  // Helper to get product types for a specific media type
  const getProductTypesForMedia = useCallback((mediaType: string) => {
    return assets.mediaTypeData[mediaType] || [];
  }, [assets.mediaTypeData]);

  return {
    assets,
    locations,
    isLoading,
    error,
    refetch: fetchAssets,
    getMediaTypes,
    getProductTypesForMedia,
  };
}