"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#0b1b3f] overflow-hidden">

      {/* Main */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4 relative">

        {/* Background Blob */}
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-[80px] w-[260px] h-[140px] bg-[#dfe8f5] rounded-[60%_40%_60%_40%/60%_60%_40%_40%] blur-[2px]"
        /> */}

        {/* 404 Section */}
        <div className="flex items-center justify-center mb-6 relative z-10">

          {/* Left 4 */}
          <motion.span
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[140px] md:text-[180px] font-bold tracking-tight text-[#0b1b3f]"
          >
            4
          </motion.span>

          {/* Center SVG */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-4"
          >
            <img src='/illustrations/404.svg' alt='' width={250} />
          </motion.div>

          {/* Right 4 */}
          <motion.span
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[140px] md:text-[180px] font-bold tracking-tight text-[#0b1b3f]"
          >
            4
          </motion.span>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-[28px] font-semibold mb-3"
        >
          Opps! Something Wrong
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-500 max-w-[420px] text-[13px] leading-relaxed mb-6"
        >
          We&apos;re sorry, the page you have looked for does not exist in our
          database! Maybe go to our home page or try to use a search?
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            href="/"
            className="bg-[#2b7bbb] hover:bg-[#256aa5] text-white px-6 py-[10px] rounded-md text-[13px] font-medium transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Go Back to Home
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="pb-8 text-center text-gray-500 text-sm">

        {/* Links */}
        <div className="flex justify-center gap-6 mb-4">
          {["About", "Contact Us", "Request a quote", "Media", "Blog"].map((item) => (
            <span
              key={item}
              className="hover:text-[#0b1b3f] cursor-pointer transition"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-5 mb-4">
          <CircleIcon />
          <CircleIcon />
          <CircleIcon />
          <CircleIcon />
        </div>

        <p className="text-xs">
          © 2025 VAAD Media, Inc. All rights reserved
        </p>
      </div>
    </div>
  );
}

/* ---------------- SVG FACE ---------------- */

function SadFace() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Circle */}
      <circle cx="60" cy="60" r="50" fill="#2b7bbb" />

      {/* Eyes */}
      <path
        d="M40 50 Q45 45 50 50"
        stroke="#0b1b3f"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M70 50 Q75 45 80 50"
        stroke="#0b1b3f"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Sad Mouth */}
      <path
        d="M40 75 Q60 60 80 75"
        stroke="#0b1b3f"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Sweat Drop */}
      <path
        d="M90 30 Q95 20 100 30 Q95 40 90 30Z"
        fill="#a6c8f0"
      />
    </svg>
  );
}

/* ---------------- SOCIAL ICON ---------------- */

function CircleIcon() {
  return (
    <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#0b1b3f] hover:text-white transition cursor-pointer">
      <div className="w-2 h-2 bg-current rounded-full" />
    </div>
  );
}