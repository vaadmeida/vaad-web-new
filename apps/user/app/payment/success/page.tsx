"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Copy, ArrowRight, Home } from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const reference = searchParams.get("reference") || "—";
  const orderId = searchParams.get("orderId") || "—";
  const amount = searchParams.get("amount");

  const formattedAmount =
    amount != null && !Number.isNaN(Number(amount))
      ? `₦${Number(amount).toLocaleString()}`
      : "—";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-8 pt-10 pb-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
            <CheckCircle2 className="text-white" size={36} />
          </div>
          <h1 className="text-2xl font-bold text-white">Payment Initiated</h1>
          <p className="text-white/90 text-sm mt-2">
            Your order has been created successfully
          </p>
        </div>

        <div className="px-8 py-8 space-y-5">
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3">
            <div className="flex justify-between items-center gap-3">
              <span className="text-sm text-gray-500">Reference</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 font-mono">
                  {reference}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg hover:bg-gray-200 transition"
                  aria-label="Copy reference"
                >
                  <Copy size={14} className="text-gray-500" />
                </button>
              </div>
            </div>
            {copied && (
              <p className="text-xs text-emerald-600 text-right">Copied!</p>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Order ID</span>
              <span className="text-sm font-medium text-gray-800 font-mono truncate max-w-[200px]">
                {orderId}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Amount</span>
              <span className="text-sm font-bold text-gray-900">
                {formattedAmount}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Status</span>
              <span className="text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                Initiated
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">
            Keep your payment reference safe. You&apos;ll receive a confirmation
            once payment is completed. If a payment gateway was involved,
            complete the process there to finalize this order.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Back to Home
            </button>
            <Link
              href="/cart"
              className="flex-1 h-12 rounded-xl bg-[#0177AB] text-white font-medium hover:bg-[#155d86] transition flex items-center justify-center gap-2"
            >
              View Cart
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
          <div className="w-10 h-10 border-2 border-[#0177AB] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}