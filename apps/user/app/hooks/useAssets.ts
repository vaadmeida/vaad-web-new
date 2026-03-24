/* eslint-disable @typescript-eslint/no-explicit-any */
// app/hooks/useAssets.ts
import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/app/lib/api/client";

interface AssetsData {
  services: string[];
  mediaType: string[];
  statesAndCites: Record<string, string[]>;
}

export function useAssets() {
  const [assets, setAssets] = useState<AssetsData>({
    services: [],
    mediaType: [],
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
      
      // Extract data from response
      const services = response.services || [];
      const mediaType = response.mediaType || [];
      const statesAndCites = response.statesAndCites || {};
      
      // Flatten all cities from statesAndCites for location dropdown
      const allLocations: string[] = [];
      Object.values(statesAndCites).forEach((cities: any) => {
        if (Array.isArray(cities)) {
          allLocations.push(...cities);
        }
      });
      
      setAssets({ services, mediaType, statesAndCites });
      setLocations(allLocations);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
      setError(err instanceof Error ? err.message : "Failed to load filter options");
      // Fallback to default values if API fails
      setAssets({
        services: ["Outdoor Advertising", "Indoor Advertising", "Digital Signage"],
        mediaType: ["Led Billboard", "Static Billboard", "Digital Screen", "Gantry", "Wall Wrap"],
        statesAndCites: {},
      });
      setLocations(["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu"]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return {
    assets,
    locations,
    isLoading,
    error,
    refetch: fetchAssets,
  };
}