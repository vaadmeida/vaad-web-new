"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function PaymentErrorPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") ?? "N/A";
  const message =
    searchParams.get("message") ?? "Your payment could not be completed. Please try again or contact support.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-red-100 bg-white p-8 shadow-xl shadow-red-100/50">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4 text-red-600">
            <AlertCircle className="h-12 w-12" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-600">Payment failed</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">We could not complete your payment</h1>
          <p className="mt-4 text-base text-slate-600">{message}</p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium text-slate-500">Reference</span>
            <span className="font-semibold text-slate-900">{reference}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex-1 rounded-xl bg-[#0177AB] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#006693]"
          >
            Try again
          </Link>
          <Link
            href="/contact-us"
            className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Contact support
          </Link>
        </div>
      </div>
    </main>
  );
}
