/* eslint-disable @typescript-eslint/no-explicit-any */
// app/hooks/useBlogAssets.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { blogService, BlogAssets } from "@/app/lib/blog/blog-service";

interface UseBlogAssetsReturn {
  assets: BlogAssets | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBlogAssets(): UseBlogAssetsReturn {
  const [assets, setAssets] = useState<BlogAssets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await blogService.getAssets();
      if (isMounted.current) {
        setAssets(data);
      }
    } catch (err: any) {
      console.error("Failed to fetch blog assets:", err);
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : "Failed to load blog data");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchAssets();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchAssets]);

  return {
    assets,
    loading,
    error,
    refetch: fetchAssets,
  };
}