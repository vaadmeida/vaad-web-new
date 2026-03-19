"use client";

import Hero from "./components/Home/Hero";
import Navbar from "./components/layout/Navbar";
import TopBar from "./components/layout/TopBar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />
      <Hero />
    </div>
  );
}

