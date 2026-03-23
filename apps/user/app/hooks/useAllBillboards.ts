/* eslint-disable @typescript-eslint/no-explicit-any */
// app/hooks/useAllBillboards.ts
import { useState, useEffect, useCallback } from "react";
import { Billboard, billboardService } from "../lib/billboard/billboard-service";


interface UseAllBillboardsReturn {
  allBillboards: Billboard[];
  staticBillboards: Billboard[];
  ledBillboards: Billboard[];
  digitalBillboards: Billboard[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAllBillboards(): UseAllBillboardsReturn {
  const [allBillboards, setAllBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBillboards = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await billboardService.searchBillboards();
      const items = (response as any).foundItems || response.data || [];

      setAllBillboards(items);
    } catch (err) {
      console.error("Failed to fetch billboards:", err);
      setError(err instanceof Error ? err.message : "Failed to load billboards");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBillboards();
  }, [fetchBillboards]);

  // Memoized filtered arrays
  const staticBillboards = allBillboards.filter(
    (b) => b.mediaType === "Static Billboard"
  );
  const ledBillboards = allBillboards.filter(
    (b) => b.mediaType === "Led Billboard"
  );
  const digitalBillboards = allBillboards.filter(
    (b) => b.mediaType === "Digital Screen"
  );

  return {
    allBillboards,
    staticBillboards,
    ledBillboards,
    digitalBillboards,
    loading,
    error,
    refetch: fetchBillboards,
  };
}