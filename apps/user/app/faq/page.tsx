"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/Home/Footer";
import SimilarMedia from "../components/SimilarMedia";
import { useContact } from "../hooks/useContact";

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
}

export default function FaqPage() {
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
            <div className=" mx-auto text-center flex flex-col items-center">
              <h1 className="text-3xl md:text-[68.36px] font-bold mb-4">
                Frequently Asked Questions
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FaqAccordion />
          </div>
        </section>
      </div>

      {/* MAP SECTION */}
      <Map />
      <Footer />
    </>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import Map from "../components/Map";

const faqData = [
  {
    question: "What services does VAAD Media offer?",
    answer:
      "We provide end-to-end outdoor advertising solutions such as billboards, LED digital screens, bus wraps, lamp post ads, wall murals, and other high-impact OOH advertising formats.",
  },
  {
    question: "Can VAAD help me choose the best location for my campaign?",
    answer:
      "Yes, we analyze traffic data, audience demographics, and campaign goals to recommend the most effective locations.",
  },
  {
    question: "How much does it cost to advertise with VAAD?",
    answer:
      "Pricing depends on location, format, duration, and campaign scale. Contact us for a tailored quote.",
  },
  {
    question: "Can VAAD handle creative design and printing for my campaign?",
    answer:
      "Absolutely. We provide full creative support including design, printing, and production.",
  },
  {
    question:
      "How long does it take to launch my campaign after I make payment?",
    answer:
      "Typically within a few days, depending on production and placement requirements.",
  },
  {
    question: "Do you offer proof of display?",
    answer:
      "Yes, we provide proof of display including images and reports for transparency.",
  },
  {
    question: "Can I run a short-term campaign?",
    answer: "Yes, we offer flexible campaign durations to suit your needs.",
  },
  {
    question: "Do you operate only in Lagos?",
    answer:
      "While Lagos is our primary market, we also execute campaigns across other cities.",
  },
  {
    question: "Can small businesses advertise with VAAD?",
    answer: "Yes, we provide scalable solutions for businesses of all sizes.",
  },
  {
    question: "What is the first step to get started?",
    answer:
      "Reach out via our contact form or call us, and our team will guide you through the process.",
  },
];

function FaqAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <>
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />

      <div className="space-y-4">
        {faqData.map((item, index) => {
          const isOpen = activeIndex === index;

          return (
            <motion.div
              key={index}
              layout
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`rounded-md border ${
                isOpen
                  ? "bg-white border-gray-200 shadow-sm"
                  : "border-transparent"
              }`}
            >
              {/* Header */}
              <button
                onClick={() => setActiveIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-[15px] md:text-[18px] font-semibold text-[#0177AB]">
                  {item.question}
                </span>

                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-[#2563eb] text-xl font-semibold"
                >
                  {isOpen ? "−" : "+"}
                </motion.span>
              </button>

              {/* Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-[14px] text-[#000B33] leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
