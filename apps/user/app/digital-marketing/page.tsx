/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Navbar from "../components/layout/Navbar";
import Image from "next/image";
import Footer from "../components/Home/Footer";
import SimilarMedia from "../components/SimilarMedia";
import { CheckCircle2 } from "lucide-react";
import Select from "../components/SelectInput";
import Link from "next/link";

export default function DigitalMarketingPage() {
  const [activeTab, setActiveTab] = useState<"media-partner" | "main-contact">(
    "media-partner",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Toggles state ✅
  const [contactPrefs, setContactPrefs] = useState({
    call: true,
    email: false,
  });

  // STEP HANDLER ✅
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // STEP 1 → GO TO STEP 2
    if (activeTab === "media-partner") {
      setActiveTab("main-contact");
      return;
    }

    // STEP 2 → SUBMIT
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 1 UI
  const renderMediaPartnerForm = () => (
    <div className="bg-transparent border border-[#EDEDF2] rounded-2xl p-8">
      <div className="text-center mb-8">
        <h3 className="text-[20px] font-semibold text-[#1A1A21]">
          Provide Campaign Details
        </h3>
        <p className="text-[14px] text-[#8C94A6] mt-1">
          Fill out these details to build your media booking
        </p>
      </div>

      <div className="space-y-6">
        <Select
          label="Campaign Objectives"
          options={[{ label: "Enter Subject", value: "" }]}
        />
        <Select
          label="Preferred Advertising Platform"
          options={[{ label: "Anne@example.com", value: "" }]}
        />
        <Select
          label="Advertising Budget"
          options={[{ label: "Anne@example.com", value: "" }]}
        />
      </div>

      <div className="flex gap-4 mt-10">
        <button
          type="button"
          className="flex-1 h-[52px] rounded-lg border border-[#0177AB] text-[#0177AB] text-sm hover:bg-[#F5FAFD]"
        >
          Save Draft
        </button>

        {/* IMPORTANT: NOT submit */}
        <button
          type="button"
          onClick={() => setActiveTab("main-contact")}
          className="flex-1 h-[52px] rounded-lg bg-[#1E6F9F] text-white text-sm hover:bg-[#155d86]"
        >
          Next Step
        </button>
      </div>
    </div>
  );

  // TOGGLE COMPONENT ✅
  const Toggle = ({
    active,
    onClick,
  }: {
    active: boolean;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      className={`w-10 h-6 rounded-full cursor-pointer transition ${
        active ? "bg-[#2F6FED]" : "bg-gray-200"
      } relative`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition ${
          active ? "right-0.5" : "left-0.5"
        }`}
      />
    </div>
  );

  // STEP 2 UI
  const renderContactForm = () => (
    <div className="bg-transparent border border-[#EDEDF2] rounded-2xl p-8">
      <div className="text-center mb-8">
        <h3 className="text-[20px] font-semibold text-[#1A1A21]">
          Contact Personal Details
        </h3>
        <p className="text-[14px] text-[#8C94A6] mt-1">
          Fill the form to get started.
        </p>
      </div>

      <div className="space-y-6">
        <Input label="Name" placeholder="Enter Subject" />
        <Input label="Email Address" placeholder="Anne@example.com" />
        <Input label="Phone Number" placeholder="Anne@example.com" />
        <Input label="Location" placeholder="Anne@example.com" />

        {/* TOGGLES */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#1A1A21]">Please call me</span>
            <Toggle
              active={contactPrefs.call}
              onClick={() =>
                setContactPrefs((prev) => ({
                  ...prev,
                  call: !prev.call,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8C94A6]">Send an email</span>
            <Toggle
              active={contactPrefs.email}
              onClick={() =>
                setContactPrefs((prev) => ({
                  ...prev,
                  email: !prev.email,
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <button
          type="button"
          onClick={() => setActiveTab("media-partner")}
          className="flex-1 h-[52px] rounded-lg border border-[#0177AB] text-[#0177AB] text-sm hover:bg-[#F5FAFD]"
        >
          Back
        </button>

        {/* FINAL SUBMIT */}
        <button
          type="submit"
          className="flex-1 h-[52px] rounded-lg bg-[#1E6F9F] text-white text-sm hover:bg-[#155d86]"
        >
          {isSubmitting ? "Submitting..." : "Send Request"}
        </button>
      </div>
    </div>
  );

  const renderForm = () => {
    if (isSubmitted) {
      return (
        <div className="bg-white rounded-xl p-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 text-green-500" size={40} />
          <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
          <p className="text-gray-600 mb-6">
            Please expect a follow-up call from our team.
          </p>
          <Button onClick={() => setIsSubmitted(false)}>Submit Another</Button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit}>
        {activeTab === "media-partner" && renderMediaPartnerForm()}
        {activeTab === "main-contact" && renderContactForm()}
      </form>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="fixed top-0 w-full z-50">
          <Navbar />
        </div>

        {/* Hero Section */}
        <section data-theme="dark" className="relative bg-linear-to-r from-[#0088b5] to-[#006d91] text-white pt-24 pb-16">
          {/* Background GIF */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/video/vaad-bg.gif"
              alt="VAAD Media Billboard"
              fill
              priority
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
              <h1 className="text-3xl md:text-[68.36px] font-bold mb-4">
                Digital Marketing
              </h1>
              <p className="text-lg md:text-[15.19px] font-semibold text-white mb-8 max-w-100 text-center">
                Ready to grow your business with smart marketing. Complete the
                form to get started
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                <Link
                  href="/digital-marketing"
                  className="hover:text-white transition-colors"
                >
                  Home
                </Link>
                <span>&gt;</span>
                <span className="text-white">Digital Marketing</span>
              </div>
            </div>
          </div>
        </section>

        <section data-theme="light" className="py-20 px-24">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-8">
            {renderForm()}

            {/* STEP PANEL */}
            <div className="bg-transparent border border-[#EDEDF2] rounded-2xl p-6 h-fit">
              <div className="space-y-8">
                {/* STEP 1 */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      activeTab === "media-partner"
                        ? "bg-[#1E6F9F] text-white"
                        : "border border-[#D9D9D9] text-[#8C94A6]"
                    }`}
                  >
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A21]">
                      Campaign Details
                    </p>
                    <p className="text-xs text-[#8C94A6] mt-1 max-w-[220px] leading-relaxed">
                      Fill out these details and get your campaign ready
                    </p>
                  </div>
                </div>

                {/* STEP 2 */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      activeTab === "main-contact"
                        ? "bg-[#1E6F9F] text-white"
                        : "border border-[#D9D9D9] text-[#8C94A6]"
                    }`}
                  >
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A21]">
                      Contact Personal Details
                    </p>
                    <p className="text-xs text-[#8C94A6] mt-1 max-w-[220px] leading-relaxed">
                      Fill the form to get started.
                    </p>
                  </div>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="my-8 border-t border-[#EDEDF2]" />

              {/* HELP SECTION */}
              <div>
                <p className="text-sm font-medium text-[#1A1A21] mb-1">
                  Need Help?
                </p>
                <p className="text-xs text-[#8C94A6] mb-4 leading-relaxed">
                  Get to know how your campaign can reach a wider audience.
                </p>

                <button className="px-4 py-2 text-sm border border-[#D9D9D9] rounded-lg text-[#1A1A21] hover:bg-gray-50 transition">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <SimilarMedia />
      <Footer />
    </>
  );
}
