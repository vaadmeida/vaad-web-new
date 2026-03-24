/* eslint-disable @typescript-eslint/no-explicit-any */
// app/hooks/useContact.ts
"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/app/contexts/toast-context";
import { ContactRequest, contactService } from "../lib/contact-us/contact-service";

interface UseContactReturn {
  submitContact: (data: ContactRequest) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

export function useContact(): UseContactReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();

  const submitContact = useCallback(async (data: ContactRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await contactService.submitContact(data);
      
      if (response && response._id) {
        setIsSuccess(true);
        showToast?.({
          type: 'success',
          message: 'Message sent successfully! We will get back to you shortly.',
          duration: 5000,
        });
        return true;
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err: any) {
      console.error("Failed to submit contact:", err);
      const errorMessage = err?.message || err?.response?.data?.message || "Failed to send message. Please try again.";
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
    submitContact,
    isLoading,
    error,
    isSuccess,
    reset,
  };
}