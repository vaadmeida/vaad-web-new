/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/contexts/toast-context";
import { useAuthContext } from "@/app/contexts/auth-context";
import {
  paymentService,
  InitializePaymentRequest,
  InitializePaymentResponse,
} from "@/app/lib/payment/payment-service";

interface UsePaymentReturn {
  isPaying: boolean;
  error: string | null;
  lastOrder: InitializePaymentResponse | null;
  initializePayment: (
    data: InitializePaymentRequest
  ) => Promise<InitializePaymentResponse | null>;
  clearError: () => void;
}

export function usePayment(): UsePaymentReturn {
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastOrder, setLastOrder] =
    useState<InitializePaymentResponse | null>(null);

  const { isAuthenticated } = useAuthContext();
  const { showToast } = useToast();
  const router = useRouter();

  const clearError = useCallback(() => setError(null), []);

  const initializePayment = useCallback(
    async (data: InitializePaymentRequest) => {
      if (!isAuthenticated) {
        showToast?.({
          type: "warning",
          message: "Please log in to continue to payment",
          duration: 3000,
        });
        return null;
      }

      if (!data?.orderItems?.length) {
        showToast?.({
          type: "warning",
          message: "Your cart is empty",
          duration: 3000,
        });
        return null;
      }

      setIsPaying(true);
      setError(null);

      try {
        const order = await paymentService.initializePayment(data);
        setLastOrder(order);

        const payUrl = order.authorizationUrl || order.paymentUrl;
        if (payUrl) {
          window.location.href = payUrl;
          return order;
        }

        router.push(
          `/payment/success?reference=${encodeURIComponent(
            order.reference
          )}&orderId=${encodeURIComponent(order._id)}&amount=${order.amount}`
        );

        showToast?.({
          type: "success",
          message: "Order initialized successfully",
          duration: 3000,
        });

        return order;
      } catch (err: any) {
        const raw =
          err?.message ||
          err?.data?.message ||
          "Failed to initialize payment";
        const msg = Array.isArray(raw) ? raw.join(", ") : String(raw);

        setError(msg);
        showToast?.({
          type: "error",
          message: msg,
          duration: 4000,
        });

        router.push(`/payment/error?message=${encodeURIComponent(msg)}`);
        return null;
      } finally {
        setIsPaying(false);
      }
    },
    [isAuthenticated, router, showToast]
  );

  return {
    isPaying,
    error,
    lastOrder,
    initializePayment,
    clearError,
  };
}