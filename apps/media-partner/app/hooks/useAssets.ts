/* eslint-disable @typescript-eslint/no-explicit-any */
// app/hooks/useAssets.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/app/lib/api/client";

export interface AssetsData {
  services: string[];
  mediaAndProductsTypes: Record<string, string[]>;
  orientation: string[];
  printProductType: string[];        // ← Now a flat array
  landmarks: string[];
  statesAndCites: Record<string, string[]>;
  targetAudience: string[];
}

interface UseAssetsReturn {
  assets: AssetsData;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getCitiesForState: (state: string) => string[];
}

export function useAssets(): UseAssetsReturn {
  const [assets, setAssets] = useState<AssetsData>({
    services: [],
    mediaAndProductsTypes: {},
    orientation: [],
    printProductType: [],
    landmarks: [],
    statesAndCites: {},
    targetAudience: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<AssetsData>("/billboards/assets");
      setAssets(response);
    } catch (err: any) {
      console.error("Failed to fetch assets:", err);
      setError(err.message || "Failed to load form data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const getCitiesForState = useCallback((state: string): string[] => {
    if (!state || !assets.statesAndCites[state]) return [];
    return assets.statesAndCites[state];
  }, [assets.statesAndCites]);

  return {
    assets,
    isLoading,
    error,
    refetch: fetchAssets,
    getCitiesForState,
  };
}