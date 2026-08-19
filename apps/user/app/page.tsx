"use client";

import ConsultationCTA from "./components/ConsultationCTA";
import AvailableBillboardsSection from "./components/Home/AvailableBillboardsSection";
import Footer from "./components/Home/Footer";
import FrequentSection from "./components/Home/Frequent";
import Hero from "./components/Home/Hero";
import HotDealsSection from "./components/Home/HotDealSection";
import LargeFormatSection from "./components/Home/LargeFormatSection";
import StatsSection from "./components/Home/stats-section";
import TestimonialSection from "./components/Home/TestimonialSection";
import Trusted from "./components/Home/Trusted";
import Navbar from "./components/layout/Navbar";
import TopBar from "./components/layout/TopBar";
import BillboardSection from "./components/Home/BillboardSection";
import LedBillboardSection from "./components/Home/LedBillboard";
import LamppostSection from "./components/Home/Lamppost";
import AirportSection from "./components/Home/Airport";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-white">
      <TopBar />
      <Navbar />
      <Hero />
      <Trusted />
      <StatsSection />
      <AvailableBillboardsSection />
      <BillboardSection />
      <LedBillboardSection />
     {/*<BillboardPromo />*/}
      <LamppostSection />
      <AirportSection />
     {/*<BusShelterSection />*/}
      <HotDealsSection />
      <LargeFormatSection />
      {/*<RetailStoreSection />*/}
      <FrequentSection />
      <TestimonialSection />
      {/* <FeaturedPartnersSection /> */}
      {/* <Testimonial /> */}
      <ConsultationCTA />
      <Footer />
    </div>
  );
}
