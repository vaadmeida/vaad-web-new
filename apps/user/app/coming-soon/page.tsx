/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ComingSoonPage() {
  const targetDate = new Date("2026-05-01T00:00:00"); // 🔥 change this

  const calculateTimeLeft = () => {
    const diff = targetDate.getTime() - new Date().getTime();

    const time = {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };

    return diff > 0 ? time : null;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-6">
      <div className="w-full bg-[#1E6F9F] rounded-2xl overflow-hidden relative text-white p-12">
        
        {/* Background blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-40 h-40 bg-white rounded-full absolute top-10 left-10 blur-3xl" />
          <div className="w-60 h-60 bg-white rounded-full absolute bottom-10 right-10 blur-3xl" />
        </div>

        <div className="relative z-10 text-center">
          <p className="text-sm opacity-80 mb-2">VAAD</p>

          <h2 className="text-2xl font-semibold mb-6">
            Coming Soon
          </h2>

          {/* Countdown */}
          {timeLeft ? (
            <div className="flex justify-center gap-6 text-center">
              {["days", "hours", "minutes", "seconds"].map((unit, i) => (
                <motion.div
                  key={unit}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl font-bold">
                    {String((timeLeft as any)[unit]).padStart(2, "0")}
                  </p>
                  <span className="text-xs opacity-80 capitalize">
                    {unit}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-lg font-medium">We are live 🚀</p>
          )}
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-white rounded-t-[100%]" />
      </div>
    </div>
  );
}