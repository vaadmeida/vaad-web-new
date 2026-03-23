/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { mediaRequestService, MediaRequest } from "@/app/lib/media/media-request-service";
import { useToast } from "@/app/contexts/toast-context";

interface UseMediaRequestReturn {
  submitRequest: (data: MediaRequest) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

export function useMediaRequest(): UseMediaRequestReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();

  const submitRequest = useCallback(async (data: MediaRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await mediaRequestService.submitMediaRequest(data);
      
      if (response && response._id) {
        setIsSuccess(true);
        showToast?.({
          type: 'success',
          message: 'Media request submitted successfully!',
          duration: 5000,
        });
        return true;
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (err: any) {
      console.error("Failed to submit media request:", err);
      const errorMessage = err?.message || err?.response?.data?.message || "Failed to submit request. Please try again.";
      setError(errorMessage);
      showToast?.({
        type: 'error',
        message: errorMessage,
        duration: 5000,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const reset = useCallback(() => {
    setError(null);
    setIsSuccess(false);
    setIsLoading(false);
  }, []);

  return {
    submitRequest,
    isLoading,
    error,
    isSuccess,
    reset,
  };
}