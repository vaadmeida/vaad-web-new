/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Billboard,
  billboardService,
} from "../lib/billboard/billboard-service";

interface UseBillboardsOptions {
  mediaType?: string;
  autoFetch?: boolean;
  autoRefreshInterval?: number; // in milliseconds (e.g., 30000 for 30 seconds)
}

interface LandingPageResponse {
  landingPageBillboards: Record<string, Billboard[]>;
}

interface UseBillboardsReturn {
  billboards: Billboard[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setBillboards: React.Dispatch<React.SetStateAction<Billboard[]>>;
  // Optional: expose grouped data if needed
  groupedBillboards: Record<string, Billboard[]>;
}

export function useBillboards(
  options: UseBillboardsOptions = {},
): UseBillboardsReturn {
  const { mediaType, autoFetch = true, autoRefreshInterval } = options;

  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [groupedBillboards, setGroupedBillboards] = useState<Record<string, Billboard[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const normalizeBillboards = useCallback((payload: any): Billboard[] => {
    const candidates = [
      payload,
      payload?.data,
      payload?.items,
      payload?.results,
      payload?.billboards,
      payload?.foundItems,
      payload?.landingPageBillboards,
      payload?.data?.items,
      payload?.data?.results,
      payload?.data?.billboards,
      payload?.data?.foundItems,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate as Billboard[];
      }

      if (candidate && typeof candidate === "object") {
        const values = Object.values(candidate as Record<string, unknown>);
        const flattened = values.filter(Array.isArray);
        if (flattened.length > 0) {
          return flattened.flat() as Billboard[];
        }
      }
    }

    return [];
  }, []);

  const fetchBillboards = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await billboardService.searchBillboards();

      if (!isMounted.current) return;

      const landingPageData = response?.landingPageBillboards as Record<string, Billboard[]> | undefined;
      const normalized = normalizeBillboards(response);

      if (landingPageData && typeof landingPageData === "object") {
        const grouped = landingPageData;
        setGroupedBillboards(grouped);

        const allBillboards = mediaType && grouped[mediaType]
          ? grouped[mediaType]
          : Object.values(grouped).flat();

        setBillboards(allBillboards);
        return;
      }

      if (normalized.length > 0) {
        setBillboards(normalized);
        setGroupedBillboards({});
        return;
      }

      throw new Error("No billboards were returned by the backend.");
    } catch (err: any) {
      if (err.name === "AbortError") return;

      console.error("Failed to fetch billboards:", err);
      if (isMounted.current) {
        setError(
          err instanceof Error ? err.message : "Failed to load billboards",
        );
        setBillboards([]);
        setGroupedBillboards({});
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [mediaType, normalizeBillboards]);

  useEffect(() => {
    isMounted.current = true;

    if (autoFetch) {
      fetchBillboards();
    }

    // Auto-refresh setup
    let refreshInterval: NodeJS.Timeout | null = null;
    if (autoRefreshInterval && autoRefreshInterval > 0) {
      refreshInterval = setInterval(() => {
        if (isMounted.current) {
          fetchBillboards();
        }
      }, autoRefreshInterval);
    }

    // Cleanup function
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [fetchBillboards, autoFetch, autoRefreshInterval]);

  return {
    billboards,
    loading,
    error,
    refetch: fetchBillboards,
    setBillboards,
    groupedBillboards,
  };
}