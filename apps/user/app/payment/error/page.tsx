"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, HelpCircle } from "lucide-react";

function PaymentErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const message =
    searchParams.get("message") ||
    "Something went wrong while initializing your payment.";

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-red-500 to-rose-600 px-8 pt-10 pb-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
            <AlertCircle className="text-white" size={36} />
          </div>
          <h1 className="text-2xl font-bold text-white">Payment Failed</h1>
          <p className="text-white/90 text-sm mt-2">
            We couldn&apos;t complete the payment request
          </p>
        </div>

        <div className="px-8 py-8 space-y-5">
          <div className="rounded-xl bg-red-50 border border-red-100 p-4">
            <p className="text-sm font-medium text-red-800 mb-1">
              Error details
            </p>
            <p className="text-sm text-red-700 break-words">{message}</p>
          </div>

          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-2">
            <p className="text-sm font-medium text-gray-800">What you can do</p>
            <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside">
              <li>Check your internet connection and try again</li>
              <li>Confirm you&apos;re still logged in</li>
              <li>Make sure your cart still has items</li>
              <li>Contact support if this keeps happening</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/cart")}
              className="flex-1 h-12 rounded-xl bg-[#0177AB] text-white font-medium hover:bg-[#155d86] transition flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
            <Link
              href="/"
              className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Home
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <HelpCircle size={12} />
            Need help? Contact support with the error message above.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
          <div className="w-10 h-10 border-2 border-[#0177AB] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentErrorContent />
    </Suspense>
  );
}