"use client";

import { useState } from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Link from "next/link";
import Navbar from "../components/layout/Navbar";
import Image from "next/image";
import Footer from "../components/Home/Footer";
import SimilarMedia from "../components/SimilarMedia";
import { useMediaRequest } from "@/app/hooks/useMediaRequest";
import Select from "../components/SelectInput";

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  location: string;
  budget: string;
  preferredTimeToCall: string;
  interest: string;
}

// Options for dropdowns
const timeOptions = [
  { label: "Morning (9 AM - 12 PM)", value: "Morning (9 AM - 12 PM)" },
  { label: "Afternoon (12 PM - 5 PM)", value: "Afternoon (12 PM - 5 PM)" },
  { label: "Evening (5 PM - 8 PM)", value: "Evening (5 PM - 8 PM)" },
  { label: "Any time", value: "Any time" },
];

const interestOptions = [
  { label: "Billboard Advertising", value: "Billboard Advertising" },
  { label: "Digital Marketing", value: "Digital Marketing" },
  { label: "Social Media Management", value: "Social Media Management" },
  { label: "Brand Strategy", value: "Brand Strategy" },
  { label: "Media Planning", value: "Media Planning" },
  { label: "Other", value: "Other" },
];

const budgetRanges = [
  { label: "$1,000 - $5,000", value: "$1,000 - $5,000" },
  { label: "$5,000 - $10,000", value: "$5,000 - $10,000" },
  { label: "$10,000 - $25,000", value: "$10,000 - $25,000" },
  { label: "$25,000 - $50,000", value: "$25,000 - $50,000" },
  { label: "$50,000+", value: "$50,000+" },
];

const locations = [
  { label: "Lagos", value: "Lagos" },
  { label: "Abuja", value: "Abuja" },
  { label: "Port Harcourt", value: "Port Harcourt" },
  { label: "Ibadan", value: "Ibadan" },
  { label: "Kano", value: "Kano" },
  { label: "Enugu", value: "Enugu" },
  { label: "Other", value: "Other" },
];

// Map budget string to numeric value
const getBudgetValue = (budgetString: string): number | undefined => {
  const budgetMap: Record<string, number> = {
    "$1,000 - $5,000": 5000,
    "$5,000 - $10,000": 10000,
    "$10,000 - $25,000": 25000,
    "$25,000 - $50,000": 50000,
    "$50,000+": 50000,
  };
  return budgetMap[budgetString];
};

export default function MediaRequestPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    location: "",
    budget: "",
    preferredTimeToCall: "",
    interest: "",
  });

  const { submitRequest, isLoading, error, isSuccess } = useMediaRequest();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare payload matching the API schema
    const payload = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      companyName: formData.companyName || undefined,
      location: formData.location || undefined,
      budget: getBudgetValue(formData.budget),
      preferredTimeToCall: formData.preferredTimeToCall || undefined,
      interest: formData.interest || undefined,
    };

    await submitRequest(payload);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      companyName: "",
      location: "",
      budget: "",
      preferredTimeToCall: "",
      interest: "",
    });
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
                Request a Media Plan
              </h1>
              <p className="text-lg md:text-[15.19px] font-semibold text-white mb-8 max-w-100 text-center">
                Get your Billboard Ad delivered in 24hrs and Get Discounted
                Billboard Offers.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <span>&gt;</span>
                <span className="text-white">Media Request</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Header Section */}
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-[29.46px] font-semibold text-[#1A1A21] mb-4">
                  Request a media plan
                </h2>
                <p className="text-[#8C94A6] text-[19.64px] font-normal max-w-2xl mx-auto">
                  Speak with our OOH Media Experts for personalized,
                  step-by-step guidance to ensure you secure the perfect
                  strategic
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="max-w-[706.98px] mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Form Section */}
              {!isSuccess ? (
                <form
                  onSubmit={handleSubmit}
                  className="w-full max-w-[706.98px] mx-auto"
                >
                  <div className="grid grid-cols-1 gap-6 justify-center items-center">
                    <Input
                      label="Name *"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Email Address *"
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Phone Number *"
                      name="phoneNumber"
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Company Name"
                      name="companyName"
                      type="text"
                      placeholder="Enter company name"
                      value={formData.companyName}
                      onChange={handleChange}
                    />

                    <Select
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      options={locations}
                      placeholder="Select your city/area"
                    />

                    <Select
                      label="Budget Range"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      options={budgetRanges}
                      placeholder="Select budget range"
                    />

                    <Select
                      label="Preferred Time To Call"
                      name="preferredTimeToCall"
                      value={formData.preferredTimeToCall}
                      onChange={handleChange}
                      options={timeOptions}
                      placeholder="Select preferred time"
                    />

                    <Select
                      label="I am interested in"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      options={interestOptions}
                      placeholder="Select your interest"
                    />
                  </div>

                  <div className="mt-8 min-w-full">
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth={false}
                      size="lg"
                      disabled={isLoading}
                      className="bg-[#0177AB] hover:bg-[#006d91] text-white font-semibold flex justify-center items-center py-[19.64px] px-[29.46px] w-95 mx-auto rounded-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        "Submit Form"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                // Success Message
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center max-w-[706.98px] mx-auto">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Thank You!
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Thank you for sharing your brief. Please expect a follow-up
                    call from a customer service representative within 24 hours.
                  </p>
                  <Button
                    onClick={handleReset}
                    variant="primary"
                    className="bg-[#0088b5] hover:bg-[#006d91]"
                  >
                    Submit Another Request
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <SimilarMedia />
      <Footer />
    </>
  );
}