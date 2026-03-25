/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/app/contexts/toast-context";
import { newsletterService } from "../lib/newsletter/newsletter-service";

interface UseNewsletterReturn {
  subscribe: (email: string) => Promise<boolean>;
  unsubscribe: (email: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

export function useNewsletter(): UseNewsletterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();

  const subscribe = useCallback(async (email: string): Promise<boolean> => {
    if (!email) return false;
    
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await newsletterService.joinNewsletter(email);
      
      if (response && response.email) {
        setIsSuccess(true);
        showToast?.({
          type: 'success',
          message: 'Successfully subscribed to newsletter! 🎉',
          duration: 5000,
        });
        return true;
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (err: any) {
      console.error("Failed to subscribe:", err);
      const errorMessage = err?.message || err?.response?.data?.message || "Failed to subscribe. Please try again.";
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

  const unsubscribe = useCallback(async (email: string): Promise<boolean> => {
    if (!email) return false;
    
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await newsletterService.leaveNewsletter(email);
      
      if (response && response.email) {
        setIsSuccess(true);
        showToast?.({
          type: 'success',
          message: 'Successfully unsubscribed from newsletter.',
          duration: 5000,
        });
        return true;
      } else {
        throw new Error('Failed to unsubscribe');
      }
    } catch (err: any) {
      console.error("Failed to unsubscribe:", err);
      const errorMessage = err?.message || err?.response?.data?.message || "Failed to unsubscribe. Please try again.";
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
    subscribe,
    unsubscribe,
    isLoading,
    error,
    isSuccess,
    reset,
  };
}