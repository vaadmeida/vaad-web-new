"use client";

import BillboardSection from "./components/Home/BillboardSection";
import Hero from "./components/Home/Hero";
import LamppostSection from "./components/Home/Lamppost";
import LedBillboardSection from "./components/Home/LedBillboard";
import StatsSection from "./components/Home/stats-section";
import Navbar from "./components/layout/Navbar";
import TopBar from "./components/layout/TopBar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />
      <Hero />
      <StatsSection />
      <BillboardSection />
      <LedBillboardSection />
      <LamppostSection />
    </div>
  );
}

