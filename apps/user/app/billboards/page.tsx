"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/Home/Footer";
import BillboardCard from "@/app/components/billboard/BillboardCard";
import { billboardService } from "@/app/lib/billboard/billboard-service";
import { Billboard } from "@/app/lib/billboard/billboard-service";
import Link from "next/link";

export default function AllBillboardsPage() {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await billboardService.searchBillboards({ limit: 24, page: 1 });
        const items = response.foundItems || response.data || [];
        setBillboards(Array.isArray(items) ? items : []);
      } catch (err: unknown) {
        console.error("Failed to load all billboards:", err);
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load billboards.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBillboards();
  }, []);

  return (
    <>
      <Navbar transparent={false} />
      <main className="min-h-screen bg-[#F7F9FC] pt-24">
        <section className="px-4 sm:px-18 py-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[#0177AB]">
                  Discover billboard inventory
                </p>
                <h1 className="text-3xl font-bold text-[#101828] md:text-4xl">
                  All Available Billboards
                </h1>
              </div>
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-[#0177AB] hover:underline"
              >
                Back to home
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[420px] animate-pulse rounded-2xl bg-gray-200"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                {error}
              </div>
            ) : billboards.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-600">
                No billboards are currently available.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {billboards.map((billboard) => (
                  <BillboardCard key={billboard._id} billboard={billboard} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
