/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/app/lib/api/client";

// Interface matching the actual API response
interface AssetsData {
  services: string[];
  mediaAndProductsTypes: Record<string, string[]>;
  orientation: string[];
  printProductType: string[];
  landmarks: string[];
  statesAndCites: Record<string, string[]>;
  targetAudience: string[];
}

export function useAssets() {
  const [assets, setAssets] = useState<AssetsData>({
    services: [],
    mediaAndProductsTypes: {},
    orientation: [],
    printProductType: [],
    landmarks: [],
    statesAndCites: {},
    targetAudience: [],
  });
  const [locations, setLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<any>("/billboards/assets");
      
      // Extract data from response - using actual API structure
      const services = response.services || [];
      const mediaAndProductsTypes = response.mediaAndProductsTypes || {};
      const orientation = response.orientation || [];
      const printProductType = response.printProductType || [];
      const landmarks = response.landmarks || [];
      const statesAndCites = response.statesAndCites || {};
      const targetAudience = response.targetAudience || [];
      
      // Flatten all cities from statesAndCites for location dropdown
      const allLocations: string[] = [];
      Object.values(statesAndCites).forEach((cities: any) => {
        if (Array.isArray(cities)) {
          allLocations.push(...cities);
        }
      });
      
      setAssets({ 
        services, 
        mediaAndProductsTypes, 
        orientation, 
        printProductType, 
        landmarks, 
        statesAndCites, 
        targetAudience 
      });
      setLocations(allLocations);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
      setError(err instanceof Error ? err.message : "Failed to load filter options");
      
      // Fallback to default values if API fails
      setAssets({
        services: ["Outdoor Advertising", "Indoor Advertising", "Digital Signage"],
        mediaAndProductsTypes: {
          "Static Billboard": ["48 Sheet", "98 Sheet", "Unipole", "Gantry"],
          "LED Billboard": ["LED Billboard", "Gantry LED", "Mobile LED Billboard"],
          "Transit Advertising": ["BRT", "Mini Bus branding", "Tricycle branding"],
        },
        orientation: ["landscape", "portrait"],
        printProductType: [],
        landmarks: [],
        statesAndCites: {
          "Lagos": ["Ikeja", "Surulere", "Lekki", "Victoria Island"],
          "Abuja": ["Garki", "Wuse", "Maitama"],
        },
        targetAudience: [],
      });
      setLocations(["Ikeja", "Surulere", "Lekki", "Garki", "Wuse"]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Helper to get all media types
  const getMediaTypes = useCallback(() => {
    return Object.keys(assets.mediaAndProductsTypes);
  }, [assets.mediaAndProductsTypes]);

  // Helper to get product types for a specific media type
  const getProductTypesForMedia = useCallback((mediaType: string) => {
    return assets.mediaAndProductsTypes[mediaType] || [];
  }, [assets.mediaAndProductsTypes]);

  // Helper to get cities for a specific state
  const getCitiesForState = useCallback((state: string) => {
    if (!state || !assets.statesAndCites[state]) return [];
    return assets.statesAndCites[state];
  }, [assets.statesAndCites]);

  // Helper to get print products for a media type
  const getPrintProductsForMediaType = useCallback((mediaType: string) => {
    if (!mediaType || !assets.mediaAndProductsTypes[mediaType]) return assets.printProductType;
    return assets.mediaAndProductsTypes[mediaType];
  }, [assets.mediaAndProductsTypes, assets.printProductType]);

  // Helper to get all states
  const getStates = useCallback(() => {
    return Object.keys(assets.statesAndCites);
  }, [assets.statesAndCites]);

  return {
    assets,
    locations,
    isLoading,
    error,
    refetch: fetchAssets,
    getMediaTypes,
    getProductTypesForMedia,
    getCitiesForState,
    getPrintProductsForMediaType,
    getStates,
  };
}