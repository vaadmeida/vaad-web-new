"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] px-6">
      <div className="text-center max-w-lg w-full">
        {/* 404 Animated */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <span className="text-[80px] font-bold text-[#0D0A19]">4</span>

          {/* Sad Face */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 rounded-full bg-[#1E6F9F] flex items-center justify-center text-white text-2xl"
          >
            😞
          </motion.div>

          <span className="text-[80px] font-bold text-[#0D0A19]">4</span>
        </motion.div>

        {/* Text */}
        <h2 className="text-xl font-semibold text-[#1A1A21] mb-2">
          Opps! Something Wrong
        </h2>

        <p className="text-sm text-[#8C94A6] mb-6">
          We’re sorry, the page you requested could not be found.
        </p>

        {/* Button */}
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#1E6F9F] text-white rounded-lg text-sm hover:bg-[#155d86] transition"
        >
          Go Back to Home
        </Link>

        {/* Footer */}
        <div className="mt-10 text-xs text-[#8C94A6]">
          © {new Date().getFullYear()} VAAD MEDIA, All rights reserved
        </div>
      </div>
    </div>
  );
}