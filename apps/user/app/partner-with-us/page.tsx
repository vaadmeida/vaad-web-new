/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Link from "next/link";
import Navbar from "../components/layout/Navbar";
import Image from "next/image";
import Footer from "../components/Home/Footer";
import SimilarMedia from "../components/SimilarMedia";
import { CheckCircle2 } from "lucide-react";
import MediaPartnerCard from "../components/Card/MediaPartnerCard";
import { motion } from "framer-motion";

export default function PartnerWithUsPage() {
  const [activeTab, setActiveTab] = useState<any>("media-partner");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form data states
  const [mediaPartnerData, setMediaPartnerData] = useState({
    agencyName: "",
    businessAddress: "",
    cacCertificate: null as File | null,
    vatCertificate: null as File | null,
  });

  const tabs = [
    { id: "media-partner", label: "Media Partner" },
    { id: "main-contact", label: "Main Contact Person" },
    { id: "secondary-contact", label: "Secondary Contact Person" },
  ];

  const [mainContactData, setMainContactData] = useState({
    name: "",
    designation: "",
    phoneNumber: "",
    email: "",
  });

  const [secondaryContactData, setSecondaryContactData] = useState({
    name: "",
    designation: "",
    phoneNumber: "",
    email: "",
    billboardLocations: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: string,
  ) => {
    const { name, value } = e.target;
    if (section === "media-partner") {
      setMediaPartnerData((prev) => ({ ...prev, [name]: value }));
    } else if (section === "main-contact") {
      setMainContactData((prev) => ({ ...prev, [name]: value }));
    } else if (section === "secondary-contact") {
      setSecondaryContactData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0] || null;
    setMediaPartnerData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", { activeTab, data: getCurrentFormData() });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentFormData = () => {
    switch (activeTab) {
      case "media-partner":
        return mediaPartnerData;
      case "main-contact":
        return mainContactData;
      case "secondary-contact":
        return secondaryContactData;
    }
  };

  const benefits = [
    "FREE Listing, No hidden fees, no catch!",
    "Zero Subscription Fee",
    "Maximum Exposure – Reach millions of potential advertisers effortlessly",
    "Revenue Boost – Tap into a vast pool of advertisers ready to book their next campaign",
    "Free Marketing",
    "Ready Advertisers",
    "User-friendly listing process",
    "24/7 Support",
  ];

  const renderMediaPartnerForm = () => (
    <div className="space-y-6">
      <div className="bg-white border border-[#EDEDF2] rounded-xl p-6">
        <div className="">
          <h3 className="text-[20px] font-semibold text-[#1A1A21]">
            MEDIA PARTNER CONTACT DETAILS
          </h3>
          <p className="text-[16px] text-[#8C94A6] font-normal mb-6 w-125">
            Grow Your Billboard Revenue. List Your Billboards On www.vaad.com.ng
            For Free.
          </p>

          <div className="grid grid-cols-1 gap-6">
            <div className="col-span-2">
              <Input
                label="OOH Media Agency Name"
                name="agencyName"
                type="text"
                placeholder="Enter Subject"
                value={mediaPartnerData.agencyName}
                onChange={(e) => handleInputChange(e, "media-partner")}
                required
              />
            </div>

            <div className="col-span-2">
              <Input
                label="Business/Office Address"
                name="businessAddress"
                type="text"
                placeholder="Enter business address"
                value={mediaPartnerData.businessAddress}
                onChange={(e) => handleInputChange(e, "media-partner")}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#9A9EA7] mb-1.5">
                Upload CAC Certificate
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) => handleFileChange(e, "cacCertificate")}
                className="w-full px-3 py-2 text-sm border border-dashed border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0088b5] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#0088b5] file:text-white hover:file:bg-[#006d91]"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#9A9EA7] mb-1.5">
                Upload VAT Registration Certificate
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) => handleFileChange(e, "vatCertificate")}
                className="w-full px-3 py-2 text-sm border border-dashed border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0088b5] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#0088b5] file:text-white hover:file:bg-[#006d91]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMainContactForm = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-[20px] font-semibold text-[#1A1A21]">
          Main Contact Person
        </h3>
        <p className="text-[16px] text-[#8C94A6] font-normal mb-6 w-125">
          Grow Your Billboard Revenue. List Your Billboards On www.vaad.com.ng
          For Free.
        </p>

        <div className="grid grid-cols-1 gap-6">
          <Input
            label="Name Of Contact Person"
            name="name"
            type="text"
            placeholder="Enter Subject"
            value={mainContactData.name}
            onChange={(e) => handleInputChange(e, "main-contact")}
            required
          />

          <Input
            label="Designation"
            name="designation"
            type="text"
            placeholder="Enter designation"
            value={mainContactData.designation}
            onChange={(e) => handleInputChange(e, "main-contact")}
            required
          />

          <Input
            label="Mobile Phone Number"
            name="phoneNumber"
            type="tel"
            placeholder="Enter mobile number"
            value={mainContactData.phoneNumber}
            onChange={(e) => handleInputChange(e, "main-contact")}
            required
          />

          <Input
            label="Active Email Address"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={mainContactData.email}
            onChange={(e) => handleInputChange(e, "main-contact")}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderSecondaryContactForm = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-[20px] font-semibold text-[#1A1A21]">
          Secondary Contact Person
        </h3>
        <p className="text-[16px] text-[#8C94A6] font-normal mb-6 w-125">
          Grow Your Billboard Revenue. List Your Billboards On www.vaad.com.ng
          For Free.
        </p>

        <div className="grid grid-cols-1 gap-6">
          <Input
            label="Name Of Contact Person"
            name="name"
            type="text"
            placeholder="Enter Subject"
            value={secondaryContactData.name}
            onChange={(e) => handleInputChange(e, "secondary-contact")}
            required
          />

          <Input
            label="Designation"
            name="designation"
            type="text"
            placeholder="Enter designation"
            value={secondaryContactData.designation}
            onChange={(e) => handleInputChange(e, "secondary-contact")}
            required
          />

          <Input
            label="Mobile Phone Number"
            name="phoneNumber"
            type="tel"
            placeholder="Enter mobile number"
            value={secondaryContactData.phoneNumber}
            onChange={(e) => handleInputChange(e, "secondary-contact")}
            required
          />

          <Input
            label="Active Email Address"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={secondaryContactData.email}
            onChange={(e) => handleInputChange(e, "secondary-contact")}
            required
          />

          <Input
            label="Billboard Locations"
            name="billboardLocations"
            type="text"
            placeholder="Enter billboard locations"
            value={secondaryContactData.billboardLocations}
            onChange={(e) => handleInputChange(e, "secondary-contact")}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderForm = () => {
    if (isSubmitted) {
      return (
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Application Submitted!
          </h3>
          <p className="text-gray-600 mb-6">
            Thank you for sharing your brief. Please expect a follow-up call
            from a customer service representative.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="primary"
            className="bg-[#0088b5] hover:bg-[#006d91]"
          >
            Submit Another Application
          </Button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit}>
        {activeTab === "media-partner" && renderMediaPartnerForm()}
        {activeTab === "main-contact" && renderMainContactForm()}
        {activeTab === "secondary-contact" && renderSecondaryContactForm()}

        <div className="flex gap-4 mt-8">
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-[1.5px] py-4 border-[#0177AB] text-[#0177AB] hover:bg-gray-50"
            onClick={() => {
              setActiveTab("media-partner");
              setIsSubmitted(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1 bg-[#0177AB] py-4 hover:bg-[#006d91]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Proceed"}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar - Fixed at top with high z-index */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>

        {/* Hero Section */}
        <section className="relative bg-linear-to-r from-[#0088b5] to-[#006d91] text-white pt-24 pb-16">
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
                Partner With Us
              </h1>
              <p className="text-lg md:text-[15.19px] font-semibold text-white mb-8 max-w-100 text-center">
                Get Your Billboard Ad Delivered In 24hrs and Get Discounted
                Billboard Offer.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <span>&gt;</span>
                <span className="text-white">Partner With Us</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-18 px-24">
          <div className="mb-8">
            <h2 className="text-[27.92px] font-semibold text-[#1A1A21] mb-2">
              Partner With Us
            </h2>
            <p className="text-[18.62px] text-[#8C94A6] w-[550px]">
              Speak with our OOH Media Experts for personalized, step-by-step
              guidance to ensure you secure the perfect strategic
            </p>
          </div>

          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              {/* Tab Navigation */}
              <div className="relative border-b border-gray-200 mb-8">
                <div className="flex flex-wrap gap-6">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative pb-3 text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? "text-[#0088b5]"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        {tab.label}

                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="tab-indicator"
                            className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#0088b5] rounded-full"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="flex gap-8">
                {/* Form Column */}
                <div className="lg:col-span-2">{renderForm()}</div>

                {/* Card Column */}
                <div className="lg:col-span-1 max-w-125">
                  <MediaPartnerCard
                    title="BECOME OUR MEDIA PARTNER"
                    description="Grow Your Billboard Revenue. List Your Billboards On www.vaad.com For Free. Why Partner with VAAD?"
                    benefits={benefits}
                    showHelp={true}
                  />
                </div>
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
