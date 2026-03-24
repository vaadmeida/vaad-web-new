// app/contact-us/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/Home/Footer";
import SimilarMedia from "../components/SimilarMedia";
import { useContact } from "@/app/hooks/useContact";

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const { submitContact, isLoading, error, isSuccess, reset } = useContact();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber || undefined,
      message: formData.message,
    };

    const success = await submitContact(payload);
    if (success) {
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    });
    reset();
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
                Contact Us
              </h1>
              <p className="text-lg md:text-[15.19px] font-semibold text-white mb-8 max-w-100 text-center">
                Have any question in mind or want to enquire? Please feel free
                to contact us through the form or the following details.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <span>&gt;</span>
                <span className="text-white">Contact</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-[#f5f7fa]">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* LEFT CARD - Contact Details */}
            <div className="bg-white rounded-[8px] shadow-sm overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="bg-[#2b78a6] px-6 py-4">
                <h3 className="text-white text-[16px] font-semibold">
                  Contact Details
                </h3>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Office Address */}
                <div className="mb-6">
                  <h4 className="text-[13px] font-semibold text-gray-800 mb-3">
                    Office Address
                  </h4>
                  <div className="flex items-start gap-3 text-[12.5px] text-gray-600 leading-relaxed">
                    <span className="text-red-500 mt-0.5">📍</span>
                    <p>
                      1b, Ayawesawere Street,
                      <br />
                      Off Lateef Jakande Road, Agidingbi,
                      <br />
                      Ikeja, Lagos.
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-5" />

                {/* Contact Info */}
                <div>
                  <h4 className="text-[13px] font-semibold text-gray-800 mb-3">
                    Contact Info
                  </h4>

                  <div className="space-y-3 text-[12.5px] text-gray-600">
                    <div className="flex items-center gap-3">
                      <span className="text-red-500">📞</span>
                      <span>(+234) 808 559 7663</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-red-500">📞</span>
                      <span>(+234) 901 794 4928</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-red-500">✉️</span>
                      <span>briefs@vaad.com.ng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="bg-white rounded-[8px] shadow-sm border border-gray-100 p-6">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name*"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full h-[44px] px-4 text-[13px] border border-gray-200 rounded-[4px] bg-[#f9fafb] focus:bg-white focus:outline-none focus:border-[#2b78a6] transition"
                  />

                  {/* Email */}
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address*"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-[44px] px-4 text-[13px] border border-gray-200 rounded-[4px] bg-[#f9fafb] focus:bg-white focus:outline-none focus:border-[#2b78a6] transition"
                  />

                  {/* Phone Number (Optional) */}
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone number (optional)"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full h-[44px] px-4 text-[13px] border border-gray-200 rounded-[4px] bg-[#f9fafb] focus:bg-white focus:outline-none focus:border-[#2b78a6] transition"
                  />

                  {/* Message */}
                  <div className="relative">
                    <textarea
                      name="message"
                      placeholder="Write your message*"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-[13px] border border-gray-200 rounded-[4px] bg-[#f9fafb] focus:bg-white focus:outline-none focus:border-[#2b78a6] resize-none"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <p className="text-red-500 text-xs mt-2">{error}</p>
                  )}

                  {/* Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-4 bg-[#2b78a6] hover:bg-[#1f5f85] text-white text-[13px] font-medium px-6 py-2.5 rounded-[4px] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </button>

                  <p className="text-[11px] text-gray-400 mt-2">
                    We'll get back to you within 24 hours.
                  </p>
                </form>
              ) : (
                /* Success Message */
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={handleReset}
                    className="bg-[#2b78a6] hover:bg-[#1f5f85] text-white text-[13px] font-medium px-6 py-2.5 rounded-[4px] transition"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MAP SECTION */}
          <div className="mt-16 max-w-6xl mx-auto px-6">
            <div className="w-full h-[360px] rounded-[10px] overflow-hidden shadow-sm border border-gray-200 relative group">
              {/* Overlay for premium feel */}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition duration-500 z-10 pointer-events-none" />

              {/* Google Map */}
              <iframe
                src="https://www.google.com/maps?q=1B%20Awayewaserere%20St%2C%20Ogba%2C%20Ikeja%2C%20Lagos&z=15&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating Location Card */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-lg shadow-md border border-gray-200 z-20 max-w-[260px]">
                <p className="text-[12px] font-semibold text-gray-900 mb-1">
                  Our Office
                </p>
                <p className="text-[11.5px] text-gray-600 leading-relaxed">
                  1B Awayewaserere St, off Lateef Jakande Road,
                  <br />
                  Ogba, Ikeja 100212, Lagos
                </p>
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