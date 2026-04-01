/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Billboard,
  billboardService,
} from "../lib/billboard/billboard-service";

interface UseBillboardsOptions {
  mediaType?: string;
  autoFetch?: boolean;
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
  const { mediaType, autoFetch = true } = options;

  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [groupedBillboards, setGroupedBillboards] = useState<Record<string, Billboard[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchBillboards = useCallback(async () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await billboardService.searchBillboards();

      // Only update if component is still mounted
      if (!isMounted.current) return;

      // Handle new landingPageBillboards structure
      const landingPageData = (response as any).landingPageBillboards as Record<string, Billboard[]>;
      
      if (landingPageData && typeof landingPageData === 'object') {
        // Store grouped data
        setGroupedBillboards(landingPageData);

        // Flatten all billboards or filter by media type
        let allBillboards: Billboard[] = [];
        
        if (mediaType && landingPageData[mediaType]) {
          // Return only specific media type
          allBillboards = landingPageData[mediaType];
        } else {
          // Flatten all media types into single array
          allBillboards = Object.values(landingPageData).flat();
        }

        setBillboards(allBillboards);
      } else {
        // Fallback to old structure for backward compatibility
        const fallbackBillboards =
          (response as any).foundItems ||
          response.data ||
          (Array.isArray(response) ? response : []);

        if (!Array.isArray(fallbackBillboards)) {
          throw new Error("Invalid response format from API");
        }

        setBillboards(fallbackBillboards);
        setGroupedBillboards({});
      }
    } catch (err: any) {
      // Ignore abort errors
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
  }, [mediaType]);

  useEffect(() => {
    isMounted.current = true;

    if (autoFetch) {
      fetchBillboards();
    }

    // Cleanup function
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchBillboards, autoFetch]);

  return {
    billboards,
    loading,
    error,
    refetch: fetchBillboards,
    setBillboards,
    groupedBillboards,
  };
}