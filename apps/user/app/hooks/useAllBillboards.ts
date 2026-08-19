/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Billboard,
  billboardService,
} from "../lib/billboard/billboard-service";

interface UseAllBillboardsReturn {
  allBillboards: Billboard[];
  groupedBillboards: Record<string, Billboard[]>;
  staticBillboards: Billboard[];
  ledBillboards: Billboard[];
  lamppostBillboards: Billboard[];
  airportBillboards: Billboard[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAllBillboards(): UseAllBillboardsReturn {
  const [groupedBillboards, setGroupedBillboards] = useState<
    Record<string, Billboard[]>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBillboards = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await billboardService.searchBillboards();
      const groups = response.landingPageBillboards || {};
      setGroupedBillboards(groups);
    } catch (err: any) {
      console.error("Failed to fetch billboards:", err);
      setError(
        err?.message ||
          (err instanceof Error ? err.message : "Failed to load billboards")
      );
      setGroupedBillboards({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBillboards();
  }, [fetchBillboards]);

  const allBillboards = useMemo(
    () => Object.values(groupedBillboards).flat(),
    [groupedBillboards]
  );

  const staticBillboards = useMemo(
    () => groupedBillboards["Static Billboard"] ?? [],
    [groupedBillboards]
  );

  const ledBillboards = useMemo(
    () => groupedBillboards["LED Billboard"] ?? [],
    [groupedBillboards]
  );

  const lamppostBillboards = useMemo(
    () => groupedBillboards["Lamppost Advertising"] ?? [],
    [groupedBillboards]
  );

  const airportBillboards = useMemo(
    () => groupedBillboards["Airport Advertising"] ?? [],
    [groupedBillboards]
  );

  return {
    allBillboards,
    groupedBillboards,
    staticBillboards,
    ledBillboards,
    lamppostBillboards,
    airportBillboards,
    loading,
    error,
    refetch: fetchBillboards,
  };
}