"use client";

import ConsultationCTA from "./components/ConsultationCTA";
import AirportSection from "./components/Home/Airport";
import BillboardPromo from "./components/Home/BillboardPromo";
import BillboardSection from "./components/Home/BillboardSection";
import BusShelterSection from "./components/Home/BusShelter";
import FeaturedPartnersSection from "./components/Home/FeaturedPartnersSection";
import Footer from "./components/Home/Footer";
import Hero from "./components/Home/Hero";
import HotDealsSection from "./components/Home/HotDealSection";
import LamppostSection from "./components/Home/Lamppost";
import LargeFormatSection from "./components/Home/LargeFormatSection";
import LedBillboardSection from "./components/Home/LedBillboard";
import RetailStoreSection from "./components/Home/RetailStore";
import StatsSection from "./components/Home/stats-section";
import Testimonial from "./components/Home/Testimonial";
import TestimonialSection from "./components/Home/TestimonialSection";
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
      <BillboardPromo />
      <LamppostSection />
      <AirportSection />
      <BusShelterSection />
      <HotDealsSection />
      <LargeFormatSection />
      <RetailStoreSection />
      <TestimonialSection />
      <FeaturedPartnersSection />
      <Testimonial />
      <ConsultationCTA />
      <Footer />
    </div>
  );
}
