/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Billboard,
  billboardService,
  ExploreParams,
} from "../lib/billboard/billboard-service";

interface UseBillboardsOptions {
  mediaType?: string;
  autoFetch?: boolean;
  autoRefreshInterval?: number;
  page?: number;
  limit?: number;
}

interface UseBillboardsReturn {
  billboards: Billboard[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setBillboards: React.Dispatch<React.SetStateAction<Billboard[]>>;
  count: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
}

export function useBillboards(
  options: UseBillboardsOptions = {}
): UseBillboardsReturn {
  const {
    mediaType,
    autoFetch = true,
    autoRefreshInterval,
    page = 1,
    limit = 10,
  } = options;

  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);

  const fetchBillboards = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: ExploreParams = { page, limit };
      if (mediaType) params.mediaType = mediaType;

      const response = await billboardService.exploreBillboards(params);
      const items = response.foundItems || response.data || [];

      if (!isMounted.current) return;

      setBillboards(items);
      setCount(response.count ?? response.total ?? items.length);
      setTotalPages(response.totalPages ?? 1);
      setCurrentPage(response.currentPage ?? response.page ?? page);
      setNextPage(response.nextPage ?? null);
    } catch (err: any) {
      console.error("Failed to fetch billboards:", err);
      if (isMounted.current) {
        setError(
          err?.message ||
            (err instanceof Error ? err.message : "Failed to load billboards")
        );
        setBillboards([]);
        setCount(0);
        setTotalPages(1);
        setNextPage(null);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [mediaType, page, limit]);

  useEffect(() => {
    isMounted.current = true;

    if (autoFetch) {
      fetchBillboards();
    }

    let refreshInterval: ReturnType<typeof setInterval> | null = null;
    if (autoRefreshInterval && autoRefreshInterval > 0) {
      refreshInterval = setInterval(() => {
        if (isMounted.current) {
          fetchBillboards();
        }
      }, autoRefreshInterval);
    }

    return () => {
      isMounted.current = false;
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [fetchBillboards, autoFetch, autoRefreshInterval]);

  return {
    billboards,
    loading,
    error,
    refetch: fetchBillboards,
    setBillboards,
    count,
    totalPages,
    currentPage,
    nextPage,
  };
}