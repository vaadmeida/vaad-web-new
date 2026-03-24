/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/app/contexts/toast-context";
import { ConsultationRequest, consultationService } from "../lib/consultation/consultation-service";

interface UseConsultationReturn {
  submitConsultation: (data: ConsultationRequest) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

export function useConsultation(): UseConsultationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();

  const submitConsultation = useCallback(async (data: ConsultationRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await consultationService.submitConsultation(data);
      
      // Check if we got a response with _id
      if (response && response._id) {
        setIsSuccess(true);
        showToast?.({
          type: 'success',
          message: 'Consultation request submitted successfully! We will contact you shortly.',
          duration: 5000,
        });
        return true;
      } else {
        throw new Error('Failed to submit consultation request');
      }
    } catch (err: any) {
      console.error("Failed to submit consultation:", err);
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
    submitConsultation,
    isLoading,
    error,
    isSuccess,
    reset,
  };
}