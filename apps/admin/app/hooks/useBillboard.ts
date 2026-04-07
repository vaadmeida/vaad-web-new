/* eslint-disable @typescript-eslint/no-explicit-any */
// app/hooks/useBillboard.ts
"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/app/lib/api/client";
import { useToast } from "@/app/contexts/toast-context";
import { BillboardFormData } from "@/app/lib/validations/billboard";

export interface CreateBillboardResponse {
  status: string;
  message: string;
  data: {
    _id: string;
    partnerId: string;
    locationAddress: string;
    description: string;
    state: string;
    city: string;
    landmark: string;
    height: number;
    width: number;
    units: string;
    rate: number;
    printProductType: string;
    serviceType: string;
    mediaType: string;
    orientation: string;
    targetAudience: string[];
    photos: string[];
    features: string[];
    hotDeal: boolean;
  };
}

export function useBillboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const createBillboard = useCallback(
    async (data: BillboardFormData) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.post<CreateBillboardResponse>(
          "/billboards/admins",
          data,
        );

        showToast({
          type: "success",
          message: response.message || "Billboard created successfully",
          duration: 4000,
        });

        return response;
      } catch (err: any) {
        const errorMessage = err.message || "Failed to create billboard";
        setError(errorMessage);
        showToast({
          type: "error",
          message: errorMessage,
          duration: 4000,
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast],
  );

  const updateBillboard = useCallback(
    async (id: string, data: Partial<BillboardFormData>) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.put<CreateBillboardResponse>(
          `/billboards/admins/${id}`,
          data,
        );

        showToast({
          type: "success",
          message: response.message || "Billboard updated successfully",
          duration: 4000,
        });

        return response;
      } catch (err: any) {
        const errorMessage = err.message || "Failed to update billboard";
        setError(errorMessage);
        showToast({
          type: "error",
          message: errorMessage,
          duration: 4000,
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast],
  );

  const getBillboard = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<CreateBillboardResponse>(
        `/billboards/admins/${id}`,
      );
      return response;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch billboard";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createBillboard,
    updateBillboard,
    getBillboard,
    isLoading,
    error,
  };
}
